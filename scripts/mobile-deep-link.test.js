import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const oidcSource = fs.readFileSync(new URL('../server/routes/oidc.js', import.meta.url), 'utf8');
const integrationSources = ['fitbit.js', 'garmin.js', 'google-health.js', 'withings.js']
  .map(name => fs.readFileSync(new URL(`../server/routes/${name}`, import.meta.url), 'utf8'));

test('mobile OAuth callbacks use a configurable scheme with a production default', () => {
  assert.match(oidcSource, /process\.env\.MOBILE_DEEP_LINK_SCHEME \|\| 'nutritrace'/);
  assert.match(oidcSource, /mobileDeepLink\('oidc-callback/);
  for (const source of integrationSources) {
    assert.match(source, /process\.env\.MOBILE_DEEP_LINK_SCHEME \|\| 'nutritrace'/);
  }
});

test('Android flavors claim distinct OAuth schemes', () => {
  const gradle = fs.readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8');
  const manifest = fs.readFileSync(new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
  assert.match(gradle, /oauthScheme: "nutritrace"/);
  assert.match(gradle, /oauthScheme: "nutritracedev"/);
  assert.match(manifest, /android:scheme="\$\{oauthScheme\}"/);
});
