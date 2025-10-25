# DNS Repair Instructions for applicants.io

## 🚨 CRITICAL ISSUES IDENTIFIED
- Root domain CNAME conflict with SRV records
- Missing A record for applicants.io
- Excessive cPanel clutter causing DNS pollution
- 73 pages showing "Not found (404)" errors due to DNS resolution issues

## 📋 STEP-BY-STEP DNS REPAIR

### PHASE 1: Delete Conflicting Records in cPanel

**Login to cPanel → DNS Zone Editor → applicants.io**

**DELETE these records:**

1. **CNAME Records to Delete:**
   - `applicants.io` → `nm7lqz3e.up.railway.app`
   - `ftp.applicants.io` → `applicants.io`

2. **A Records to Delete:**
   - `whm.applicants.io` → `66.29.146.93`
   - `webmail.applicants.io` → `66.29.146.93`
   - `cpcalendars.applicants.io` → `66.29.146.93`
   - `cpcontacts.applicants.io` → `66.29.146.93`
   - `autoconfig.applicants.io` → `66.29.146.93`
   - `autodiscover.applicants.io` → `66.29.146.93`
   - `cpanel.applicants.io` → `66.29.146.93`
   - `webdisk.applicants.io` → `66.29.146.93`

3. **SRV Records to Delete:**
   - `_caldav._tcp.applicants.io` → `applicants.io`
   - `_caldavs._tcp.applicants.io` → `applicants.io`
   - `_carddav._tcp.applicants.io` → `applicants.io`
   - `_carddavs._tcp.applicants.io` → `applicants.io`
   - `_autodiscover._tcp.applicants.io` → `cpanelemaildiscovery.cpanel.net`

4. **TXT Records to Delete:**
   - `_caldav._tcp.applicants.io` → `path=/`
   - `_caldavs._tcp.applicants.io` → `path=/`
   - `_carddavs._tcp.applicants.io` → `path=/`
   - `_carddav._tcp.applicants.io` → `path=/`

### PHASE 2: Fix and Add Clean DNS Records

**FIX the WWW CNAME:**
- Current: `www.applicants.io` CNAME → `g141wd87.up.railway.app`
- Change to: `www.applicants.io` CNAME → `nm7lqz3e.up.railway.app`

**ADD missing MX record:**

| Name | Type | Value | TTL |
|------|------|--------|------|
| applicants.io | MX | mx1-hosting.jellyfish.systems | 14400 |

**KEEP these existing records (DO NOT MODIFY):**
- `applicants.io` A → `66.29.146.93` ✅
- `www.applicants.io` CNAME → `nm7lqz3e.up.railway.app` ✅ (after fix)
- `mail.applicants.io` A → `66.29.146.93` ✅

**KEEP these existing records:**
- `default._domainkey.applicants.io` (TXT) - DKIM
- `_dmarc.applicants.io` (TXT) - DMARC
- `re4jo2o2oxcr.applicants.io` (CNAME) - Google verification
- `gv-gcrmsmv7mkszro.dv.googlehosted.com.applicants.io` (CNAME) - Google verification

### PHASE 3: Configure Redirect

**In cPanel → Redirects:**
1. Click "Add Redirect"
2. **From:** `applicants.io`
3. **To:** `https://www.applicants.io`
4. **Type:** Permanent (301)
5. **Save**

### PHASE 4: Verification

**Wait 30 minutes for DNS propagation, then test:**

```bash
# Test root domain A record
dig applicants.io +short
# Expected: 66.29.146.93

# Test www CNAME
dig www.applicants.io CNAME +short
# Expected: nm7lqz3e.up.railway.app

# Test mail server
dig mail.applicants.io +short
# Expected: 66.29.146.93

# Test MX record
dig applicants.io MX +short
# Expected: mx1-hosting.jellyfish.systems
```

## 🎯 EXPECTED RESULTS

After implementation:
- ✅ applicants.io → redirects to www.applicants.io
- ✅ www.applicants.io → loads Railway app
- ✅ Email services continue working
- ✅ Google Search Console verification preserved
- ✅ No more DNS conflicts or NXDOMAIN errors
- ✅ 404 errors should resolve

## ⚠️ IMPORTANT NOTES

1. **Backup your current DNS zone** before making changes
2. **Make changes during low-traffic hours** if possible
3. **DNS propagation can take up to 48 hours** (usually 30 minutes)
4. **Test thoroughly** before considering the repair complete
5. **Keep the Google verification records** to maintain Search Console access

## 🔧 TROUBLESHOOTING

If issues persist after 30 minutes:
1. Clear browser cache and DNS cache
2. Test from different networks/devices
3. Check Railway deployment status
4. Verify redirect is working in cPanel
5. Contact hosting provider if DNS changes don't take effect
