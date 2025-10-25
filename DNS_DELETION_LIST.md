# DNS Records to DELETE from cPanel

## 🚨 CRITICAL: Delete These Records to Fix DNS Conflicts

### CNAME Records to DELETE:
- `applicants.io` → `nm7lqz3e.up.railway.app` (CONFLICTS with MX)
- `ftp.applicants.io` → `applicants.io`

### A Records to DELETE:
- `autoconfig.applicants.io` → `66.29.146.93`
- `autodiscover.applicants.io` → `66.29.146.93`

### SRV Records to DELETE:
- `_autodiscover._tcp.applicants.io` → `cpanelemaildiscovery.cpanel.net`

### TXT Records to DELETE:
- `_caldav._tcp.applicants.io` → `path=/`
- `_caldavs._tcp.applicants.io` → `path=/`
- `_carddavs._tcp.applicants.io` → `path=/`
- `_carddav._tcp.applicants.io` → `path=/`

## ✅ KEEP These Records (DO NOT DELETE):
- `default._domainkey.applicants.io` (TXT) - DKIM authentication
- `_dmarc.applicants.io` (TXT) - DMARC policy
- `re4jo2o2oxcr.applicants.io` (CNAME) - Google Search Console verification
- `gv-gcrmsmv7mkszro.dv.googlehosted.com.applicants.io` (CNAME) - Google verification

## 📋 Step-by-Step Deletion Process:

1. **Login to cPanel**
2. **Go to DNS Zone Editor**
3. **Select applicants.io domain**
4. **For each record listed above:**
   - Find the record in the list
   - Click "Delete" or "Remove"
   - Confirm deletion
5. **Repeat for all records in the list**
6. **Save changes**

## ⚠️ IMPORTANT WARNINGS:

- **DO NOT DELETE** the DKIM, DMARC, or Google verification records
- **Make a backup** of your current DNS zone before making changes
- **Delete records one by one** to avoid mistakes
- **Double-check** each deletion before confirming

## 🎯 Expected Result:
After deletion, you should have a clean DNS zone with only the essential records needed for:
- Website hosting (Railway)
- Email services (cPanel mail)
- Google Search Console verification
- Email authentication (DKIM/DMARC)
