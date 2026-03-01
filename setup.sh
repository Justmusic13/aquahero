#!/bin/bash
set -e

echo "========================================"
echo "  AquaHero Project Setup"
echo "========================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Verify folders exist
if [ ! -d "server" ] || [ ! -d "client" ]; then
    echo "Error: server/ and client/ folders not found in the current directory."
    exit 1
fi

# Database name from the project spec
DB_NAME="aquahero"

echo ""
echo "Step 1: Database setup for '$DB_NAME'..."

# Check if PostgreSQL is installed and running
if ! command -v psql &> /dev/null; then
    echo "Error: psql command not found. Please install PostgreSQL."
    exit 1
fi

if ! sudo -u postgres psql -c '\q' 2>/dev/null; then
    echo "Error: Could not connect to PostgreSQL as the 'postgres' user."
    echo "Please ensure PostgreSQL is running: sudo systemctl start postgresql"
    exit 1
fi

# Check if database exists (Ubuntu uses sudo -u postgres)
if sudo -u postgres psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "  Database '$DB_NAME' already exists, skipping creation."
else
    echo "  Creating database '$DB_NAME'..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
fi

# Run migrations
echo "  Running migrations from server/migrations/001_initial_schema.sql..."
sudo -u postgres psql -d "$DB_NAME" -f server/migrations/001_initial_schema.sql

echo ""
echo "Step 2: Backend setup (in server/)..."
cd server

cat > .env << 'EOF'
PORT=8000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aquahero
JWT_SECRET=local-dev-secret-$(date +%s)
CLIENT_URL=http://localhost:5173
EOF

echo "  Installing backend dependencies..."
npm install
cd ..

echo ""
echo "Step 3: Frontend setup (in client/)..."
cd client

# Detect framework and create appropriate .env
if [ -f "next.config.js" ] || [ -f "next.config.mjs" ]; then
    echo "  Detected Next.js project. Creating .env for Next.js..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
else
    echo "  Detected Vite/React project. Creating .env for Vite..."
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:8000/api
EOF
fi

echo "  Installing frontend dependencies..."
npm install
cd ..

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "To start the application, run: ./start.sh"
echo ""
echo "Or, run manually in two separate terminals:"
echo "  Terminal 1: cd server && npm run dev"
echo "  Terminal 2: cd client && npm run dev"
echo ""
