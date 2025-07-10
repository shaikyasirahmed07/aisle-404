
-- Table for Products
CREATE TABLE public.products (
    productId VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    batchNumber VARCHAR(50),
    expiryDate DATE,
    location VARCHAR(50),
    MRP DECIMAL(10, 2),
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0,
    stockCount INT NOT NULL,
    scannedCount INT DEFAULT 0,
    cartAddCount INT DEFAULT 0,
    saleCount INT DEFAULT 0,
    qrLink VARCHAR(255) UNIQUE,
    shelfNumber VARCHAR(20),
    salesVelocity DECIMAL(10, 2) DEFAULT 0,
    viewCount INT DEFAULT 0,
    category VARCHAR(50),
    supplierId VARCHAR(50),
    restockThreshold INT DEFAULT 10,
    isOnPromotion BOOLEAN DEFAULT FALSE,
    qrGeneratedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for User Profiles (linking to auth.users)
CREATE TABLE public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    phoneNumber VARCHAR(15) UNIQUE,
    name VARCHAR(100),
    employeeId VARCHAR(50) UNIQUE,
    loyaltyPoints INT DEFAULT 0,
    budgetThreshold DECIMAL(10, 2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Table for Customers (for non-authenticated users)
CREATE TABLE public.customers (
    customerId SERIAL PRIMARY KEY,
    phoneNumber VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    loyaltyPoints INT DEFAULT 0,
    budgetThreshold DECIMAL(10, 2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Transactions
CREATE TABLE public.transactions (
    transactionId SERIAL PRIMARY KEY,
    userId UUID REFERENCES auth.users(id),
    customerId INT REFERENCES public.customers(customerId),
    productId VARCHAR(50) REFERENCES public.products(productId),
    quantity INT NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Reviews
CREATE TABLE public.reviews (
    reviewId SERIAL PRIMARY KEY,
    productId VARCHAR(50) REFERENCES public.products(productId),
    userId UUID REFERENCES auth.users(id),
    customerId INT REFERENCES public.customers(customerId),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Analytics (daily summary)
CREATE TABLE public.analytics (
    date DATE PRIMARY KEY,
    totalEarnings DECIMAL(10, 2),
    topProducts JSONB,
    slowMovingStock JSONB,
    suggestions TEXT
);

-- Table for Virtual Carts
CREATE TABLE public.virtual_carts (
    cartId SERIAL PRIMARY KEY,
    userId UUID REFERENCES auth.users(id),
    phoneNumber VARCHAR(15),
    productId VARCHAR(50) REFERENCES public.products(productId),
    quantity INT NOT NULL,
    addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_carts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Products: Publicly viewable, admins can manage
CREATE POLICY "Products are publicly viewable" ON public.products
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Profiles: Users can manage their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Customers: Publicly readable for basic operations
CREATE POLICY "Customers are publicly readable" ON public.customers
    FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert customers" ON public.customers
    FOR INSERT
    WITH CHECK (true);

-- Transactions: Users see their own, admins see all
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = userId);

CREATE POLICY "Admins can view all transactions" ON public.transactions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Anyone can insert transactions" ON public.transactions
    FOR INSERT
    WITH CHECK (true);

-- Reviews: Publicly viewable, authenticated users can create
CREATE POLICY "Reviews are publicly viewable" ON public.reviews
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = userId);

-- Analytics: Admins only
CREATE POLICY "Admins can view analytics" ON public.analytics
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Virtual Carts: Users can manage their own carts
CREATE POLICY "Users can manage their own cart" ON public.virtual_carts
    FOR ALL
    TO authenticated
    USING (auth.uid() = userId);

CREATE POLICY "Public cart access by phone" ON public.virtual_carts
    FOR ALL
    USING (true);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role, name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        COALESCE(NEW.raw_user_meta_data->>'name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update product metrics
CREATE OR REPLACE FUNCTION public.update_product_metrics()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products 
    SET lastUpdated = CURRENT_TIMESTAMP
    WHERE productId = NEW.productId;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product timestamp
CREATE TRIGGER update_product_timestamp
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_product_metrics();
