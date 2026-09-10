import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class OperatorConsoleSourceTests(unittest.TestCase):
    def test_operator_routes_and_dynamic_detail_routes_are_wired(self):
        routes = (ROOT / 'src/lib/routes.ts').read_text()
        app = (ROOT / 'src/App.tsx').read_text()
        for path in (
            '/app/overview', '/app/devices', '/app/fleet', '/app/analytics',
            '/app/water', '/app/alerts', '/app/maintenance', '/app/reports', '/app/settings',
        ):
            self.assertIn(path, routes)
        self.assertIn('/app/devices/', routes)
        self.assertIn('/app/water/', routes)
        self.assertIn('isOperatorRoute', routes)
        self.assertIn('OperatorShell', app)

    def test_operator_data_is_typed_synthetic_and_water_states_are_explicit(self):
        expected = ['devices.ts', 'telemetry.ts', 'batches.ts', 'alerts.ts', 'maintenance.ts', 'reports.ts']
        for name in expected:
            path = ROOT / 'src/data' / name
            self.assertTrue(path.exists(), f'missing {path.relative_to(ROOT)}')
            text = path.read_text()
            self.assertIn('synthetic-demo', text)
        batches = (ROOT / 'src/data/batches.ts').read_text()
        for state in ('RAW CONDENSATE', 'TREATED', 'VERIFICATION', 'VERIFIED FOR INTENDED USE'):
            self.assertIn(state, batches)

    def test_operator_shell_and_all_console_pages_exist(self):
        for name in ('OperatorShell.tsx', 'OperatorNav.tsx', 'AppHeader.tsx'):
            self.assertTrue((ROOT / 'src/app' / name).exists(), f'missing src/app/{name}')
        for name in (
            'OverviewPage.tsx', 'DevicesPage.tsx', 'DeviceDetailPage.tsx', 'FleetPage.tsx',
            'AnalyticsPage.tsx', 'WaterPage.tsx', 'BatchDetailPage.tsx', 'AlertsPage.tsx',
            'MaintenancePage.tsx', 'ReportsPage.tsx', 'SettingsPage.tsx',
        ):
            self.assertTrue((ROOT / 'src/app/pages' / name).exists(), f'missing src/app/pages/{name}')

    def test_console_uses_its_own_design_system_and_responsive_layer(self):
        css = ROOT / 'src/styles/console.css'
        responsive = ROOT / 'src/styles/console-responsive.css'
        self.assertTrue(css.exists())
        self.assertTrue(responsive.exists())
        text = css.read_text()
        self.assertIn('.console-shell', text)
        self.assertIn('.console-rail', text)
        self.assertIn('.console-chart', text)
        self.assertIn('.fleet-map', text)
        self.assertIn(':focus-visible', text)
        self.assertIn('prefers-reduced-motion:reduce', responsive.read_text())

    def test_frontend_only_boundary_is_explicit(self):
        settings = ROOT / 'src/app/useConsolePreferences.ts'
        self.assertTrue(settings.exists())
        text = settings.read_text()
        self.assertIn('localStorage', text)
        all_app = ''.join(path.read_text() for path in (ROOT / 'src/app').rglob('*.tsx')) if (ROOT / 'src/app').exists() else ''
        self.assertNotIn('fetch(', all_app)
        self.assertNotIn('axios', all_app)
        self.assertIn('SYNTHETIC DEMO DATA', all_app)



    def test_marketing_transition_asset_map_does_not_expand_to_operator_routes(self):
        transition = (ROOT / 'src/components/PageTransition.tsx').read_text()
        self.assertNotIn('Record<RoutePath, AtmoraAsset>', transition)
        self.assertIn('PublicRoutePath', transition)

    def test_operator_routes_stay_noindex_at_runtime(self):
        meta = (ROOT / 'src/lib/runtimeMeta.ts').read_text()
        self.assertIn("route.kind === 'operator'", meta)
        self.assertEqual(meta.count('meta[name="robots"]'), 1, 'robots metadata must have one source of truth')

    def test_devices_water_analytics_and_settings_have_interactive_frontend_controls(self):
        checks = {
            'DevicesPage.tsx': ('Search devices', 'setQuery', 'status'),
            'AnalyticsPage.tsx': ('RangeTabs', 'setRange', 'PRODUCTION_SERIES'),
            'WaterPage.tsx': ('Search batches', 'RAW CONDENSATE'),
            'AlertsPage.tsx': ('Acknowledge locally', 'setAcknowledged'),
            'SettingsPage.tsx': ('Temperature', 'Volume', 'Reduced motion'),
        }
        for name, tokens in checks.items():
            text = (ROOT / 'src/app/pages' / name).read_text()
            for token in tokens:
                self.assertIn(token, text)
        range_tabs = (ROOT / 'src/app/components/RangeTabs.tsx').read_text()
        for token in ('24H', '7D', '30D', '90D'):
            self.assertIn(token, range_tabs)

    def test_console_route_motion_and_chart_draw_are_runtime_wired(self):
        shell = (ROOT / 'src/app/OperatorShell.tsx').read_text()
        spark = (ROOT / 'src/app/components/Sparkline.tsx').read_text()
        css = (ROOT / 'src/styles/console.css').read_text()
        reduced = (ROOT / 'src/styles/console-responsive.css').read_text()
        self.assertIn('console-route-frame', shell)
        self.assertIn('key={route.path}', shell)
        self.assertIn('pathLength="1"', spark)
        self.assertIn('@keyframes console-route-in', css)
        self.assertIn('@keyframes console-chart-draw', css)
        self.assertIn('[data-console-motion=reduced]', reduced)
        self.assertIn('[data-console-motion=reduced] .console-shell *', reduced)

    def test_persisted_console_preferences_apply_from_the_shell(self):
        shell = (ROOT / 'src/app/OperatorShell.tsx').read_text()
        hook = (ROOT / 'src/app/useConsolePreferences.ts').read_text()
        self.assertIn('ConsolePreferencesProvider', shell)
        self.assertIn('consoleDensity', hook)
        self.assertIn('consoleMotion', hook)

    def test_console_unit_preferences_drive_measurement_pages(self):
        units = (ROOT / 'src/app/useConsoleUnits.ts').read_text() if (ROOT / 'src/app/useConsoleUnits.ts').exists() else ''
        self.assertIn('useConsolePreferences', units)
        self.assertIn('consoleUnits', units)
        required = ('OverviewPage.tsx','DevicesPage.tsx','DeviceDetailPage.tsx','AnalyticsPage.tsx','WaterPage.tsx','BatchDetailPage.tsx')
        for name in required:
            text = (ROOT / 'src/app/pages' / name).read_text()
            self.assertIn('useConsoleUnits', text, name)

    def test_mobile_operator_nav_reveals_the_active_module(self):
        nav = (ROOT / 'src/app/OperatorNav.tsx').read_text()
        self.assertIn('scrollIntoView', nav)
        self.assertIn("aria-current={current?'page':undefined}", nav)
        self.assertIn('prefers-reduced-motion', nav)
        self.assertIn('preferences.reducedMotion', nav)

    def test_console_preferences_have_one_provider_not_custom_event_fanout(self):
        hook = (ROOT / 'src/app/useConsolePreferences.ts').read_text()
        shell = (ROOT / 'src/app/OperatorShell.tsx').read_text()
        self.assertIn('ConsolePreferencesProvider', hook)
        self.assertIn('ConsolePreferencesProvider', shell)
        self.assertNotIn("new CustomEvent('atmora-console-preferences'", hook)

    def test_public_site_exposes_operator_demo_without_fake_login(self):
        nav = (ROOT / 'src/marketing/Nav.tsx').read_text()
        footer = (ROOT / 'src/marketing/Footer.tsx').read_text()
        for text in (nav, footer):
            self.assertIn('/app/overview', text)
            self.assertIn('Operator demo', text)
        self.assertNotIn('Sign in', nav)
        self.assertNotIn('Login', nav)

    def test_operator_console_is_noindex_at_hosting_layer(self):
        netlify = (ROOT / 'public/_headers').read_text()
        vercel = (ROOT / 'vercel.json').read_text()
        self.assertIn('/app\n  X-Robots-Tag: noindex, nofollow', netlify)
        self.assertIn('/app/*', netlify)
        self.assertIn('X-Robots-Tag: noindex, nofollow', netlify)
        self.assertIn('X-Robots-Tag', vercel)
        self.assertIn('noindex, nofollow', vercel)
        self.assertIn('"source": "/app"', vercel)

    def test_operator_console_direct_app_entry_rewrites(self):
        netlify = (ROOT / 'public/_redirects').read_text()
        self.assertIn('/app / 200', netlify)
        self.assertIn('/app/* / 200', netlify)

    def test_devices_support_status_and_water_state_filters(self):
        text = (ROOT / 'src/app/pages/DevicesPage.tsx').read_text()
        self.assertIn('DeviceWaterState', text)
        self.assertIn('waterState', text)
        self.assertIn('Device water state', text)
        self.assertIn('VERIFIED FOR INTENDED USE', text)

    def test_operator_console_release_docs_and_scripts_are_current(self):
        package = (ROOT / 'package.json').read_text()
        readme = (ROOT / 'README.md').read_text()
        start = (ROOT / 'START_HERE_RU.md').read_text()
        qa = (ROOT / 'docs/QA.md').read_text()
        self.assertIn('"version": "2.0.0"', package)
        self.assertIn('"qa:console": "python scripts/render_console_qa.py"', package)
        for text in (readme, start, qa):
            self.assertIn('Operator Console', text)
            self.assertIn('/app/overview', text)
        self.assertIn('frontend-only', readme.lower())
        self.assertIn('SYNTHETIC DEMO DATA', readme)
        self.assertIn('11', qa)
        self.assertIn('77', qa)

    def test_console_spatial_and_service_controls_keep_accessible_semantics(self):
        fleet = (ROOT / 'src/app/components/FleetMap.tsx').read_text()
        maintenance = (ROOT / 'src/app/pages/MaintenancePage.tsx').read_text()
        self.assertIn('role="group"', fleet)
        self.assertNotIn('role="img"', fleet)
        self.assertIn('role="progressbar"', maintenance)
        self.assertIn('aria-valuenow', maintenance)
        self.assertIn('aria-valuemin={0}', maintenance)
        self.assertIn('aria-valuemax={100}', maintenance)


if __name__ == '__main__':
    unittest.main()
