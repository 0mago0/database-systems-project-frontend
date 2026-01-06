#!/bin/bash
set -e

# Create roles if they don't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'animate_dp') THEN
            CREATE ROLE animate_dp WITH LOGIN PASSWORD 'animate_dp';
        END IF;
    END
    \$\$;
EOSQL

echo "Roles created successfully!"
