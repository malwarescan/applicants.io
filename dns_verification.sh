#!/bin/bash

# DNS Verification Script for applicants.io
# Run this script after implementing DNS changes to verify everything is working

echo "🔍 DNS Verification Script for applicants.io"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test DNS record
test_dns() {
    local record_type=$1
    local domain=$2
    local expected=$3
    local description=$4
    
    echo -n "Testing $description... "
    
    if [ "$record_type" = "A" ]; then
        result=$(dig +short $domain A 2>/dev/null | head -1)
    elif [ "$record_type" = "CNAME" ]; then
        result=$(dig +short $domain CNAME 2>/dev/null | head -1)
    elif [ "$record_type" = "MX" ]; then
        result=$(dig +short $domain MX 2>/dev/null | awk '{print $2}' | head -1)
    fi
    
    if [ "$result" = "$expected" ]; then
        echo -e "${GREEN}✅ PASS${NC} ($result)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected, Got: $result)"
        return 1
    fi
}

# Function to test HTTP redirect
test_redirect() {
    local from_url=$1
    local to_url=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    # Use curl to follow redirects and get final URL
    final_url=$(curl -s -o /dev/null -w "%{redirect_url}" "$from_url" 2>/dev/null)
    
    if [[ "$final_url" == *"$to_url"* ]]; then
        echo -e "${GREEN}✅ PASS${NC} (Redirects to: $final_url)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected redirect to contain: $to_url, Got: $final_url)"
        return 1
    fi
}

echo "📋 Testing DNS Records"
echo "---------------------"

# Test A records
test_dns "A" "applicants.io" "66.29.146.93" "Root domain A record"
test_dns "A" "mail.applicants.io" "66.29.146.93" "Mail server A record"

# Test CNAME records
test_dns "CNAME" "www.applicants.io" "nm7lqz3e.up.railway.app" "WWW CNAME to Railway"

# Test MX record
test_dns "MX" "applicants.io" "mx1-hosting.jellyfish.systems" "Mail exchange record"

echo ""
echo "🌐 Testing HTTP Redirects"
echo "-------------------------"

# Test redirect from root to www
test_redirect "http://applicants.io" "www.applicants.io" "Root to WWW redirect"
test_redirect "https://applicants.io" "www.applicants.io" "HTTPS Root to WWW redirect"

echo ""
echo "🔍 Testing Railway App Accessibility"
echo "-----------------------------------"

# Test if Railway app is accessible
echo -n "Testing Railway app accessibility... "
railway_response=$(curl -s -o /dev/null -w "%{http_code}" "https://www.applicants.io" 2>/dev/null)

if [ "$railway_response" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP 200)"
else
    echo -e "${RED}❌ FAIL${NC} (HTTP $railway_response)"
fi

echo ""
echo "📧 Testing Email Records"
echo "----------------------"

# Test DKIM record
echo -n "Testing DKIM record... "
dkim_result=$(dig +short default._domainkey.applicants.io TXT 2>/dev/null | grep -q "v=DKIM1" && echo "Found" || echo "Missing")
if [ "$dkim_result" = "Found" ]; then
    echo -e "${GREEN}✅ PASS${NC} (DKIM record present)"
else
    echo -e "${RED}❌ FAIL${NC} (DKIM record missing)"
fi

# Test DMARC record
echo -n "Testing DMARC record... "
dmarc_result=$(dig +short _dmarc.applicants.io TXT 2>/dev/null | grep -q "v=DMARC1" && echo "Found" || echo "Missing")
if [ "$dmarc_result" = "Found" ]; then
    echo -e "${GREEN}✅ PASS${NC} (DMARC record present)"
else
    echo -e "${RED}❌ FAIL${NC} (DMARC record missing)"
fi

echo ""
echo "🔍 Google Search Console Verification"
echo "------------------------------------"

# Test Google verification record
echo -n "Testing Google verification... "
gsc_result=$(dig +short re4jo2o2oxcr.applicants.io CNAME 2>/dev/null | grep -q "gv-gcrmsmv7mkszro.dv.googlehosted.com" && echo "Found" || echo "Missing")
if [ "$gsc_result" = "Found" ]; then
    echo -e "${GREEN}✅ PASS${NC} (Google verification record present)"
else
    echo -e "${RED}❌ FAIL${NC} (Google verification record missing)"
fi

echo ""
echo "📊 Summary"
echo "=========="
echo "If all tests pass, your DNS configuration is correct!"
echo "If any tests fail, check the DNS_REPAIR_INSTRUCTIONS.md file"
echo "and ensure all changes have been implemented correctly."
echo ""
echo "⏰ Note: DNS changes can take up to 48 hours to propagate globally."
echo "If tests fail immediately after changes, wait 30 minutes and try again."
