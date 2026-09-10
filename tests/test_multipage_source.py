import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class MultiPageSourceTests(unittest.TestCase):
    def test_cinematic_shell_contract_is_present(self):
        expected = [
            ROOT / 'src/components/PageTransition.tsx',
            ROOT / 'src/components/RouteAnnouncer.tsx',
            ROOT / 'src/components/DewProgress.tsx',
            ROOT / 'src/components/MotionOrchestrator.tsx',
        ]
        for path in expected:
            self.assertTrue(path.exists(), f'missing {path.relative_to(ROOT)}')

        motion = (ROOT / 'src/styles/motion.css').read_text()
        self.assertIn('.page-transition', motion)
        self.assertIn('[data-transition-phase="cover"]', motion)
        self.assertIn('prefers-reduced-motion:reduce', motion)

    def test_all_public_pages_are_wired(self):
        app = (ROOT / 'src/App.tsx').read_text()
        for page in ('HomePage', 'TechnologyPage', 'PlatformPage', 'LabPage', 'PilotPage'):
            self.assertIn(page, app)
        for route in ("case '/'", "case '/technology'", "case '/platform'", "case '/lab'", "case '/pilot'"):
            self.assertIn(route, app)

    def test_route_page_heroes_have_distinct_variants(self):
        expected = {
            'TechnologyHero.tsx': 'technology-hero',
            'PlatformHero.tsx': 'platform-hero',
            'LabHero.tsx': 'lab-hero',
            'PilotHero.tsx': 'pilot-hero',
        }
        for filename, marker in expected.items():
            hero = (ROOT / 'src/marketing/route-heroes' / filename).read_text()
            self.assertIn(marker, hero)

    def test_reduced_motion_disables_route_choreography_and_optical_motion(self):
        motion = (ROOT / 'src/styles/motion.css').read_text()
        reduced = motion[motion.find('@media(prefers-reduced-motion:reduce)'):]
        self.assertIn('.page-transition', reduced)
        self.assertIn('.optical-media', reduced)
        self.assertIn('[data-reveal]', reduced)

    def test_v12_cinematic_heading_contract(self):
        heading = ROOT / 'src/components/CinematicHeading.tsx'
        self.assertTrue(heading.exists(), 'missing cinematic heading primitive')
        text = heading.read_text()
        self.assertIn('cinematic-heading__line', text)
        self.assertIn('cinematic-heading__inner', text)
        motion = (ROOT / 'src/styles/motion.css').read_text()
        self.assertIn('.cinematic-heading__inner', motion)
        reduced = motion[motion.find('@media(prefers-reduced-motion:reduce)'):]
        self.assertIn('.cinematic-heading__inner', reduced)

    def test_v12_transition_uses_destination_media(self):
        transition = (ROOT / 'src/components/PageTransition.tsx').read_text()
        self.assertIn('transitionAssetByPath', transition)
        self.assertIn('page-transition__media', transition)
        motion = (ROOT / 'src/styles/motion.css').read_text()
        self.assertIn('.page-transition__media', motion)

    def test_v12_scroll_driven_hero_exit_is_progressive_and_reduced_motion_safe(self):
        motion = (ROOT / 'src/styles/motion.css').read_text()
        self.assertIn('@supports (animation-timeline: view())', motion)
        self.assertIn('animation-timeline:view()', motion)
        reduced = motion[motion.find('@media(prefers-reduced-motion:reduce)'):]
        self.assertIn('[data-route-hero-media]', reduced)
        self.assertIn('animation:none!important', reduced)

    def test_v12_route_links_warm_destination_hero_media(self):
        assets = (ROOT / 'src/lib/assets.ts').read_text()
        link = (ROOT / 'src/components/RouteLink.tsx').read_text()
        self.assertIn('heroAssetForRoute', assets)
        self.assertIn('preloadRouteHero', assets)
        self.assertIn('preloadRouteHero', link)
        self.assertIn('onPointerEnter', link)
        self.assertIn('onFocus', link)







    def test_lcp_route_media_has_avif_with_webp_fallback(self):
        assets = (ROOT / 'src/lib/assets.ts').read_text()
        for filename in ('hero-condensation.avif','condensation-flow.avif','cloud-dashboard.avif','water-batch.avif','usecase-hospitality.avif'):
            self.assertIn(filename, assets)
            self.assertTrue((ROOT / 'public/assets' / filename).exists(), f'missing {filename}')
        hero = (ROOT / 'src/marketing/Hero.tsx').read_text()
        self.assertIn('type="image/avif"', hero)
        for name in ('TechnologyHero.tsx','PlatformHero.tsx','LabHero.tsx','PilotHero.tsx'):
            text = (ROOT / 'src/marketing/route-heroes' / name).read_text()
            self.assertIn('type="image/avif"', text)

    def test_critical_media_has_mobile_sources_dimensions_and_lazy_second_fold(self):
        assets = (ROOT / 'src/lib/assets.ts').read_text()
        for filename in ('condensation-flow-mobile.webp','cloud-dashboard-mobile.webp','water-batch-mobile.webp','usecase-hospitality-mobile.webp'):
            self.assertIn(filename, assets)
            self.assertTrue((ROOT / 'public/assets' / filename).exists(), f'missing optimized {filename}')
        for name in ('TechnologyHero.tsx','PlatformHero.tsx','LabHero.tsx','PilotHero.tsx'):
            hero = (ROOT / 'src/marketing/route-heroes' / name).read_text()
            self.assertIn('<picture', hero)
            self.assertIn('width={asset.width}', hero)
            self.assertIn('height={asset.height}', hero)
        physical = (ROOT / 'src/marketing/PhysicalThesis.tsx').read_text()
        self.assertIn('loading="lazy"', physical)
        self.assertNotIn('loading="eager"', physical)

    def test_route_hero_scroll_exit_has_native_and_javascript_fallbacks(self):
        orchestrator = (ROOT / 'src/components/MotionOrchestrator.tsx').read_text()
        motion = (ROOT / 'src/styles/motion.css').read_text()
        heroes = ''.join((ROOT / 'src/marketing/route-heroes' / name).read_text() for name in ('TechnologyHero.tsx','PlatformHero.tsx','LabHero.tsx','PilotHero.tsx'))
        self.assertIn("CSS.supports('animation-timeline: view()')", orchestrator)
        self.assertIn('data-route-hero-media', heroes)
        self.assertIn('data-route-hero-copy', heroes)
        self.assertIn('[data-route-hero-media]', motion)
        self.assertIn('[data-route-hero-copy]', motion)
        self.assertIn('requestAnimationFrame', orchestrator)
        self.assertIn('--hero-exit-y', orchestrator)

    def test_pilot_methodology_is_a_decision_framework_not_step_cards(self):
        pilot = (ROOT / 'src/marketing/Pilot.tsx').read_text()
        css = (ROOT / 'src/styles/site.css').read_text()
        self.assertIn('pilot__framework', pilot)
        self.assertIn('pilot__decision-rail', pilot)
        self.assertIn('GO / CHANGE / STOP', pilot)
        self.assertIn('.pilot__framework', css)
        self.assertNotIn('pilot__steps', pilot)

    def test_intelligence_is_a_spatial_telemetry_field_not_metric_cards(self):
        intelligence = (ROOT / 'src/marketing/Intelligence.tsx').read_text()
        css = (ROOT / 'src/styles/site.css').read_text()
        self.assertIn('intelligence__telemetry', intelligence)
        self.assertIn('telemetry__trace', intelligence)
        self.assertIn('CONDITIONS', intelligence)
        self.assertIn('INTERPRETATION', intelligence)
        self.assertIn('.intelligence__telemetry', css)
        self.assertNotIn('metrics-grid', intelligence)
        self.assertNotIn('<Metric', intelligence)



    def test_mobile_critical_scientific_and_truth_labels_have_a_legibility_floor(self):
        css = (ROOT / 'src/styles/responsive.css').read_text().replace(' ', '')
        forbidden = (
            '.cloud-mobile__media.media-label{left:10px;top:10px;font-size:8px',
            '.technology-hero__instrument>divspan{font-size:8px',
            '.pilot-hero__protocol{gap:8px;margin-top:28px;font-size:7px',
            '.pilot-hero__site-note{left:18px;right:18px;bottom:18px;justify-content:space-between;font-size:7px',
            '.telemetry__annotationspan',
        )
        for token in forbidden[:4]:
            self.assertNotIn(token, css)
        self.assertRegex(css, r'\.technology-hero__instrument>divspan\{[^}]*font-size:9px')
        self.assertIn('.pilot-hero__protocol{gap:8px;margin-top:28px;font-size:9px', css)
        self.assertIn('.pilot-hero__site-note{left:18px;right:18px;bottom:18px;justify-content:space-between;font-size:9px', css)
        self.assertIn('.cloud-mobile__media.media-label{left:10px;top:10px;font-size:10px', css)
        self.assertIn('.telemetry__annotation{font-size:9px', css)

    def test_typography_system_breaks_all_caps_monotony_and_keeps_state_labels_legible(self):
        site = (ROOT / 'src/styles/site.css').read_text()
        responsive = (ROOT / 'src/styles/responsive.css').read_text()
        pilot_rule = site[site.index('.pilot-hero__title{'):site.index('}', site.index('.pilot-hero__title{'))]
        state_rule = site[site.index('.route-hero__state{'):site.index('}', site.index('.route-hero__state{'))]
        self.assertIn("'IBM Plex Sans'", pilot_rule)
        self.assertIn('text-transform:none', pilot_rule)
        self.assertIn('font-size:10px', state_rule)
        self.assertNotIn('.pilot-hero__state{top:78px;right:18px;font-size:7px', responsive)
        self.assertNotIn('.platform-hero__state{top:10px;right:10px;font-size:7px', responsive)

    def test_lab_principles_are_composed_as_threshold_fields_not_a_generic_list(self):
        principles = (ROOT / 'src/marketing/EvidencePrinciples.tsx').read_text()
        css = (ROOT / 'src/styles/site.css').read_text()
        self.assertIn('principles__thresholds', principles)
        self.assertIn('principles__threshold-line', principles)
        self.assertIn('PHYSICS', principles)
        self.assertIn('EVIDENCE', principles)
        self.assertIn('DECISION', principles)
        self.assertIn('.principles__thresholds', css)
        self.assertNotIn('principles__list', principles)

    def test_climate_reality_is_an_instrument_not_a_generic_panel(self):
        climate = (ROOT / 'src/marketing/ClimateReality.tsx').read_text()
        css = (ROOT / 'src/styles/site.css').read_text()
        self.assertIn('climate__instrument', climate)
        self.assertIn('climate__threshold-axis', climate)
        self.assertIn('climate__condition-field', climate)
        self.assertIn('.climate__instrument', css)
        self.assertNotIn('climate__panel', climate)

    def test_condensation_story_uses_explicit_physics_timeline(self):
        story = (ROOT / 'src/marketing/CondensationStory.tsx').read_text()
        timeline = ROOT / 'src/lib/condensationTimeline.ts'
        self.assertTrue(timeline.exists(), 'missing explicit condensation timeline')
        timeline_text = timeline.read_text()
        self.assertIn('CONDENSATION_TIMELINE', timeline_text)
        self.assertIn('thresholdCrossed', timeline_text)
        self.assertNotIn('Math.floor(p*8)', story.replace(' ', ''))
        self.assertIn('condensationStateAt', story)
        self.assertNotIn('aria-live="polite"', story)

    def test_static_qa_creates_its_artifact_directories(self):
        renderer = (ROOT / 'scripts/render_static_qa.py').read_text()
        self.assertIn("(ROOT/'artifacts').mkdir", renderer.replace(' ', ''))
        self.assertIn('OUT.mkdir(parents=True,exist_ok=True)', renderer.replace(' ', ''))

    def test_scroll_progress_does_not_rerender_react_each_animation_frame(self):
        hook = (ROOT / 'src/hooks/useSectionProgress.ts').read_text()
        dew = (ROOT / 'src/components/DewProgress.tsx').read_text()
        story = (ROOT / 'src/marketing/CondensationStory.tsx').read_text()
        self.assertNotIn('useState', hook)
        self.assertNotIn('setP(', hook)
        self.assertNotIn('useState', dew)
        self.assertNotIn('setProgress(', dew)
        self.assertIn('onProgress', hook)
        self.assertIn('stageKeyRef', story)

    def test_mobile_navigation_becomes_focusable_immediately_when_opened(self):
        responsive = (ROOT / 'src/styles/responsive.css').read_text().replace(' ', '')
        self.assertIn('transition:opacityvar(--ui)var(--ease-out),visibility0slinearvar(--ui)', responsive)
        self.assertIn('.site-nav[data-open=true].site-nav__mobile{opacity:1;visibility:visible;pointer-events:auto;transition-delay:0s}', responsive)

    def test_reflow_runtime_check_uses_a_400_percent_equivalent_viewport(self):
        runtime = (ROOT / 'tests/e2e/runtime.spec.ts').read_text()
        start = runtime.index("test('400% equivalent viewport keeps the primary content horizontally reflowable'")
        end = runtime.index("test('critical mobile scenes remain coherent at DPR 2'", start)
        block = runtime[start:end]
        self.assertIn("page.setViewportSize({ width: 360, height: 225 })", block)
        self.assertNotIn("document.documentElement.style.zoom = '4'", block)

    def test_router_and_mobile_navigation_have_focus_management(self):
        router = (ROOT / 'src/hooks/useRouter.tsx').read_text()
        nav = (ROOT / 'src/marketing/Nav.tsx').read_text()
        self.assertIn('focusRouteDestination', router)
        self.assertIn("getElementById('main')", router)
        self.assertIn('menuButtonRef', nav)
        self.assertIn('mobilePanelRef', nav)
        self.assertIn('.inert = true', nav)
        self.assertIn("event.key === 'Tab'", nav)
        self.assertIn('aria-modal', nav)

    def test_internal_routes_use_authored_route_specific_heroes(self):
        expected = {
            'TechnologyPage.tsx': 'TechnologyHero',
            'PlatformPage.tsx': 'PlatformHero',
            'LabPage.tsx': 'LabHero',
            'PilotPage.tsx': 'PilotHero',
        }
        for page_name, hero_name in expected.items():
            page = (ROOT / 'src/pages' / page_name).read_text()
            self.assertIn(hero_name, page)
            self.assertNotIn('EditorialPageHero', page)
            self.assertTrue((ROOT / 'src/marketing/route-heroes' / f'{hero_name}.tsx').exists())

    def test_route_specific_hero_visual_system_has_distinct_layout_contracts(self):
        css = (ROOT / 'src/styles/site.css').read_text() + (ROOT / 'src/styles/responsive.css').read_text()
        for selector in ('.technology-hero__instrument', '.platform-hero__trace', '.lab-hero__states', '.pilot-hero__protocol'):
            self.assertIn(selector, css)

    def test_atmora_uses_custom_vector_wordmark(self):
        wordmark = ROOT / 'src/components/AtmoraWordmark.tsx'
        self.assertTrue(wordmark.exists(), 'missing vector wordmark')
        nav = (ROOT / 'src/marketing/Nav.tsx').read_text()
        footer = (ROOT / 'src/marketing/Footer.tsx').read_text()
        self.assertIn('AtmoraWordmark', nav)
        self.assertIn('AtmoraWordmark', footer)
        self.assertIn('<svg', wordmark.read_text())
        self.assertIn('wordmark-threshold', wordmark.read_text())

    def test_dew_point_field_is_lightweight_threshold_driven_and_offscreen_safe(self):
        field = ROOT / 'src/components/DewPointField.tsx'
        self.assertTrue(field.exists(), 'missing signature Dew Point Field')
        text = field.read_text()
        story = (ROOT / 'src/marketing/CondensationStory.tsx').read_text()
        self.assertIn('<canvas', text)
        self.assertIn('IntersectionObserver', text)
        self.assertIn('ResizeObserver', text)
        self.assertIn('CONDENSATION_NUCLEATION_PROGRESS', text)
        self.assertIn('DewPointField', story)
        self.assertIn('fieldRef.current?.setProgress', story)
        self.assertNotIn('three', text.lower())

    def test_route_transition_uses_atmora_threshold_grammar(self):
        transition = (ROOT / 'src/components/PageTransition.tsx').read_text()
        motion = (ROOT / 'src/styles/motion.css').read_text()
        self.assertIn('page-transition__dew-line', transition)
        self.assertIn('page-transition__dry-state', transition)
        self.assertIn('page-transition__condensed-state', transition)
        self.assertIn('@keyframes transition-dew-sweep', motion)
        self.assertIn('.page-transition__dew-line', motion)

    def test_route_transition_has_bounded_destination_media_readiness_gate(self):
        assets = (ROOT / 'src/lib/assets.ts').read_text()
        router = (ROOT / 'src/hooks/useRouter.tsx').read_text()
        self.assertIn('prepareRouteHero', assets)
        self.assertIn('timeoutMs', assets)
        self.assertIn('prepareRouteHero', router)
        self.assertIn('Promise.all', router)
        self.assertIn('transitionToken', router)




    def test_assessment_has_configurable_real_backend_adapter_and_honest_fallback(self):
        assessment = (ROOT / 'src/lib/assessment.ts').read_text()
        ui = (ROOT / 'src/marketing/SiteAssessment.tsx').read_text()
        self.assertTrue((ROOT / '.env.example').exists())
        self.assertIn('VITE_ATMORA_ASSESSMENT_ENDPOINT', (ROOT / '.env.example').read_text())
        self.assertIn('fetch(', assessment)
        self.assertIn("mode:'remote'", assessment.replace(' ', ''))
        self.assertIn("mode:'local-demo'", assessment.replace(' ', ''))
        self.assertIn('VITE_ATMORA_ASSESSMENT_ENDPOINT', ui)
        self.assertIn('assessment__submit-error', ui)

    def test_assessment_moves_focus_to_each_new_progressive_step(self):
        ui = (ROOT / 'src/marketing/SiteAssessment.tsx').read_text()
        runtime = (ROOT / 'tests/e2e/runtime.spec.ts').read_text()
        self.assertIn('stepHeadingRef', ui)
        self.assertIn('preventScroll: true', ui)
        self.assertIn('assessment-step-heading', ui)
        self.assertIn('progressive assessment moves focus', runtime.lower())

    def test_real_runtime_playwright_qa_is_part_of_release_contract(self):
        package = (ROOT / 'package.json').read_text()
        config = ROOT / 'playwright.config.ts'
        spec = ROOT / 'tests/e2e/runtime.spec.ts'
        self.assertTrue(config.exists(), 'missing Playwright runtime config')
        self.assertTrue(spec.exists(), 'missing real-browser runtime QA')
        self.assertIn('@playwright/test', package)
        self.assertIn('qa:runtime', package)
        self.assertIn('playwright test', package)
        text = spec.read_text()
        for route in ('/technology','/platform','/lab','/pilot'):
            self.assertIn(route, text)
        for width in ('1440','1280','1024','768','430','390','360'):
            self.assertIn(width, text)
        self.assertIn('document.fonts.ready', text)
        self.assertIn('scrollWidth', text)

    def test_netlify_serves_prerendered_routes_and_real_404(self):
        redirects = (ROOT / 'public/_redirects').read_text()
        self.assertNotIn('/* /index.html 200', redirects)
        for route in ('/technology','/platform','/lab','/pilot'):
            self.assertIn(f'{route} {route}/index.html 200', redirects)
        self.assertIn('/* /404.html 404', redirects)

    def test_build_prerenders_routes_and_has_real_not_found_path(self):
        package = (ROOT / 'package.json').read_text()
        app = (ROOT / 'src/App.tsx').read_text()
        routes = (ROOT / 'src/lib/routes.ts').read_text()
        self.assertIn('scripts/prerender.mjs', package)
        self.assertTrue((ROOT / 'scripts/prerender.mjs').exists())
        self.assertTrue((ROOT / 'src/lib/routeMeta.json').exists())
        self.assertTrue((ROOT / 'src/pages/NotFoundPage.tsx').exists())
        self.assertIn('NotFoundPage', app)
        self.assertIn("path: '/404'", routes)
        vercel = (ROOT / 'vercel.json').read_text()
        self.assertNotIn('"dest": "/index.html"', vercel)

    def test_reduced_data_disables_decorative_optics_and_prefetch(self):
        hook = ROOT / 'src/hooks/useReducedData.ts'
        self.assertTrue(hook.exists(), 'missing reduced-data capability hook')
        hook_text = hook.read_text()
        optical = (ROOT / 'src/components/OpticalMedia.tsx').read_text()
        story = (ROOT / 'src/marketing/CondensationStory.tsx').read_text()
        assets = (ROOT / 'src/lib/assets.ts').read_text()
        transition = (ROOT / 'src/components/PageTransition.tsx').read_text()
        self.assertIn('saveData', hook_text)
        self.assertIn('useReducedData', optical)
        self.assertIn('useReducedData', story)
        self.assertIn('isReducedDataRequested', assets)
        self.assertIn('useReducedData', transition)

    def test_route_lcp_media_has_width_srcsets_and_prerender_preloads(self):
        assets = (ROOT / 'src/lib/assets.ts').read_text()
        meta = (ROOT / 'src/lib/routeMeta.json').read_text()
        prerender = (ROOT / 'scripts/prerender.mjs').read_text()
        for token in ('avifSrcSet', 'srcSet', 'mobileAvifSrcSet', 'mobileSrcSet'):
            self.assertIn(token, assets)
        self.assertIn('heroAvif', meta)
        self.assertIn('heroMobileAvif', meta)
        self.assertIn('rel="preload"', prerender)
        self.assertIn('imagesrcset', prerender)
        self.assertIn('imagesizes', prerender)

    def test_high_contrast_and_forced_colors_have_explicit_fallbacks(self):
        css = (ROOT / 'src/styles/global.css').read_text() + (ROOT / 'src/styles/site.css').read_text() + (ROOT / 'src/styles/motion.css').read_text()
        self.assertIn('@media(forced-colors:active)', css.replace(' ', ''))
        self.assertIn('forced-color-adjust:auto', css.replace(' ', ''))
        media_rule = css[css.index('.media-label{'):css.index('}', css.index('.media-label{'))]
        self.assertNotIn('font:9px', media_rule)

    def test_reduced_motion_disables_smooth_scrolling_at_the_root(self):
        css = (ROOT / 'src/styles/global.css').read_text().replace(' ', '')
        self.assertIn('@media(prefers-reduced-motion:reduce)', css)
        reduced = css[css.index('@media(prefers-reduced-motion:reduce)'):]
        self.assertIn('html{scroll-behavior:auto}', reduced)

    def test_runtime_qa_covers_history_menu_assessment_404_and_zoom(self):
        spec = (ROOT / 'tests/e2e/runtime.spec.ts').read_text()
        for token in ('goBack()', 'goForward()', "getByRole('button', { name: 'Open menu' })", '/404', 'deviceScaleFactor', 'zoom'):
            self.assertIn(token, spec)
        self.assertIn('assessment', spec.lower())

    def test_spa_navigation_updates_route_metadata_not_only_document_title(self):
        router = (ROOT / 'src/hooks/useRouter.tsx').read_text()
        meta = ROOT / 'src/lib/runtimeMeta.ts'
        self.assertTrue(meta.exists(), 'missing runtime route metadata synchronizer')
        meta_text = meta.read_text()
        self.assertIn('meta[name="description"]', meta_text)
        self.assertIn('meta[name="theme-color"]', meta_text)
        self.assertIn('link[rel="canonical"]', meta_text)
        self.assertIn('applyRuntimeRouteMeta', router)

    def test_asset_budget_is_executable_and_part_of_release_verification(self):
        script = ROOT / 'scripts/check_asset_budget.py'
        package = (ROOT / 'package.json').read_text()
        self.assertTrue(script.exists(), 'missing asset budget QA script')
        text = script.read_text()
        self.assertIn('MAX_TOTAL_BYTES', text)
        self.assertIn('MAX_LCP_AVIF_BYTES', text)
        self.assertIn('MAX_MOBILE_LCP_AVIF_BYTES', text)
        self.assertIn('qa:assets', package)
        self.assertIn('npm run qa:assets', package)

    def test_heavy_below_fold_sections_use_selective_content_visibility(self):
        css = (ROOT / 'src/styles/site.css').read_text()
        self.assertIn('content-visibility:auto', css.replace(' ', ''))
        self.assertIn('contain-intrinsic-size', css)
        self.assertNotIn('.condensation{content-visibility:auto', css.replace(' ', ''))

    def test_static_qa_mirrors_authored_route_hero_structures(self):
        renderer = (ROOT / 'scripts/render_multipage_qa.py').read_text()
        for token in ('technology-hero', 'platform-hero', 'lab-hero', 'pilot-hero'):
            self.assertIn(token, renderer)
        self.assertNotIn("hero('technology'", renderer)
        self.assertNotIn("hero('platform'", renderer)
        self.assertNotIn("hero('lab'", renderer)
        self.assertNotIn("hero('pilot'", renderer)

    def test_static_qa_rejects_cinematic_heading_line_clipping(self):
        renderer = (ROOT / 'scripts/render_multipage_qa.py').read_text()
        self.assertIn('cinematicClip', renderer)
        self.assertIn('scrollWidth - el.clientWidth', renderer)
        self.assertIn('cinematic heading clip', renderer.lower())

    def test_router_owns_scroll_restoration_for_back_and_forward_navigation(self):
        router = (ROOT / 'src/hooks/useRouter.tsx').read_text()
        runtime = (ROOT / 'tests/e2e/runtime.spec.ts').read_text()
        self.assertIn("history.scrollRestoration = 'manual'", router)
        self.assertIn('SCROLL_STATE_KEY', router)
        self.assertIn('restoreScrollY', router)
        self.assertIn('scroll position', runtime.lower())

    def test_dead_template_components_and_reference_media_are_removed(self):
        dead_files = (
            ROOT / 'src/components/EditorialPageHero.tsx',
            ROOT / 'src/components/Metric.tsx',
            ROOT / 'src/marketing/SystemOverview.tsx',
        )
        for path in dead_files:
            self.assertFalse(path.exists(), f'dead production module still present: {path.relative_to(ROOT)}')

        assets = (ROOT / 'src/lib/assets.ts').read_text()
        manifest = (ROOT / 'public/assets/manifest.json').read_text()
        self.assertNotIn('refractiveStudy', assets)
        self.assertNotIn('refractiveStudy', manifest)
        self.assertFalse((ROOT / 'public/assets/refractive-study.webp').exists(), 'unused reference media still shipped')

    def test_legacy_template_css_is_not_shipped_after_authored_hero_migration(self):
        css = ''.join((ROOT / 'src/styles' / name).read_text() for name in ('site.css', 'responsive.css', 'motion.css'))
        for token in ('.page-hero', '.system__', '.system-row', '.metric__', '.metrics-grid', '.pilot__steps'):
            self.assertNotIn(token, css, f'stale legacy selector still shipped: {token}')

    def test_active_handoff_docs_preserve_v15_runtime_polish_in_v2_release(self):
        readme = (ROOT / 'README.md').read_text()
        start = (ROOT / 'START_HERE_RU.md').read_text()
        qa = (ROOT / 'docs/QA.md').read_text()
        active_docs = readme + start + qa
        self.assertNotIn('v1.2', active_docs)
        self.assertNotIn('EditorialPageHero', active_docs)
        self.assertNotIn('approximately 2.4 MB', active_docs)
        self.assertIn('v1.5', readme)
        self.assertIn('v1.5', start)
        self.assertIn('v1.5', qa)
        self.assertIn('/privacy', readme)
        self.assertIn('69 images', qa)
        self.assertIn('4.91 MiB', qa)
        self.assertIn('VITE_ATMORA_ASSESSMENT_ENDPOINT', readme)
        self.assertIn('verify:release', start)
        package = (ROOT / 'package.json').read_text()
        self.assertIn('\"@eslint/js\": \"9.39.5\"', package)
        self.assertIn('\"eslint\": \"9.39.5\"', package)
        self.assertIn('public/_headers', readme)
        self.assertIn('--route privacy --width 390', start)
        self.assertIn('780 ms', readme)
        self.assertIn('persistent', readme.lower())
        self.assertIn('CinematicHeading', qa)
        self.assertIn('Technology', qa)

    def test_privacy_route_and_remote_assessment_consent_are_first_class(self):
        routes = (ROOT / 'src/lib/routes.ts').read_text()
        app = (ROOT / 'src/App.tsx').read_text()
        assessment = (ROOT / 'src/marketing/SiteAssessment.tsx').read_text()
        footer = (ROOT / 'src/marketing/Footer.tsx').read_text()
        meta = (ROOT / 'src/lib/routeMeta.json').read_text()
        redirects = (ROOT / 'public/_redirects').read_text()
        self.assertTrue((ROOT / 'src/pages/PrivacyPage.tsx').exists(), 'privacy route page is missing')
        self.assertIn("'/privacy'", routes)
        self.assertIn('PrivacyPage', app)
        self.assertIn('privacyAccepted', assessment)
        self.assertIn('Privacy notice', assessment)
        self.assertIn('to="/privacy"', assessment)
        self.assertIn('to="/privacy"', footer)
        self.assertIn('"path": "/privacy"', meta)
        self.assertIn('/privacy /privacy/index.html 200', redirects)

    def test_browser_identity_assets_and_head_metadata_are_shipped(self):
        index = (ROOT / 'index.html').read_text()
        prerender = (ROOT / 'scripts/prerender.mjs').read_text()
        self.assertTrue((ROOT / 'public/favicon.svg').exists(), 'missing Atmora favicon')
        self.assertTrue((ROOT / 'public/site.webmanifest').exists(), 'missing webmanifest')
        self.assertIn('rel="icon"', index)
        self.assertIn('/favicon.svg', index)
        self.assertIn('rel="manifest"', index)
        self.assertIn('/site.webmanifest', index)
        self.assertIn('mask-icon', index)
        self.assertIn('theme-color', prerender)

    def test_privacy_route_is_in_runtime_and_static_qa_contracts(self):
        runtime = (ROOT / 'tests/e2e/runtime.spec.ts').read_text()
        renderer = (ROOT / 'scripts/render_multipage_qa.py').read_text()
        self.assertIn("'/privacy'", runtime)
        self.assertIn("'privacy'", renderer)
        self.assertIn('privacy_hero', renderer)
        self.assertIn('privacy_body', renderer)

    def test_typography_family_tokens_are_defined_and_utility_pages_do_not_fall_back_to_serif(self):
        tokens = (ROOT / 'src/styles/tokens.css').read_text()
        global_css = (ROOT / 'src/styles/global.css').read_text()
        site_css = (ROOT / 'src/styles/site.css').read_text()
        self.assertIn('--font-sans:', tokens)
        self.assertIn('--font-condensed:', tokens)
        self.assertIn('--font-mono:', tokens)
        self.assertIn('font-family:var(--font-sans)', global_css.replace(' ', ''))
        self.assertNotIn('var(--sans)', site_css)
        self.assertIn('font-family:var(--font-sans)', site_css.replace(' ', ''))

    def test_every_production_image_reserves_intrinsic_dimensions(self):
        import re
        offenders = []
        for path in (ROOT / 'src').rglob('*.tsx'):
            text = path.read_text()
            for match in re.finditer(r'<img\b[^>]*>', text):
                tag = match.group(0)
                if 'width=' not in tag or 'height=' not in tag:
                    offenders.append(f"{path.relative_to(ROOT)}: {tag[:120]}")
        self.assertEqual(offenders, [], 'production images without intrinsic dimensions: ' + ' | '.join(offenders))

    def test_prerender_has_social_image_alt_and_noindex_for_not_found(self):
        meta = (ROOT / 'src/lib/routeMeta.json').read_text()
        prerender = (ROOT / 'scripts/prerender.mjs').read_text()
        index = (ROOT / 'index.html').read_text()
        self.assertIn('ogImageAlt', meta)
        self.assertIn('og:image:alt', prerender)
        self.assertIn('twitter:image:alt', prerender)
        self.assertIn('noindex, nofollow', prerender)
        self.assertIn('og:site_name', index)


    def test_privacy_route_uses_a_legible_light_surface_navigation_state(self):
        nav = (ROOT / 'src/marketing/Nav.tsx').read_text()
        site = (ROOT / 'src/styles/site.css').read_text()
        renderer = (ROOT / 'scripts/render_multipage_qa.py').read_text()
        self.assertIn("route.path === '/privacy' ? 'light' : 'dark'", nav)
        self.assertIn('data-surface', nav)
        self.assertIn('.site-nav[data-surface=light]', site)
        self.assertIn("nav_html('light')", renderer)

    def test_remote_consent_checkbox_is_required_and_describes_help_plus_error(self):
        assessment = (ROOT / 'src/marketing/SiteAssessment.tsx').read_text()
        self.assertIn('required={Boolean(endpoint)}', assessment)
        self.assertIn("'privacy-help privacy-error'", assessment)
        self.assertIn("'privacy-help'", assessment)

    def test_mobile_shell_respects_ios_safe_areas(self):
        index = (ROOT / 'index.html').read_text()
        responsive = (ROOT / 'src/styles/responsive.css').read_text()
        self.assertIn('viewport-fit=cover', index)
        compact = responsive.replace(' ', '')
        self.assertIn('env(safe-area-inset-top)', compact)
        self.assertIn('env(safe-area-inset-bottom)', compact)
        self.assertIn('.site-nav', responsive)
        self.assertIn('.site-nav__mobile', responsive)

    def test_hosting_security_and_cache_headers_are_explicit(self):
        import json
        netlify = (ROOT / 'public/_headers')
        self.assertTrue(netlify.exists(), 'missing Netlify _headers')
        headers = netlify.read_text()
        for token in ('Cache-Control: public, max-age=31536000, immutable',
                      'X-Content-Type-Options: nosniff',
                      'Referrer-Policy: strict-origin-when-cross-origin',
                      'Permissions-Policy: camera=(), microphone=(), geolocation=()'):
            self.assertIn(token, headers)
        vercel = json.loads((ROOT / 'vercel.json').read_text())
        rendered = str(vercel)
        for token in ('X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Cache-Control'):
            self.assertIn(token, rendered)

    def test_page_transition_js_and_css_share_one_timing_source(self):
        timing = ROOT / 'src/lib/motionTimings.ts'
        self.assertTrue(timing.exists(), 'missing shared page-transition timing source')
        timing_text = timing.read_text() if timing.exists() else ''
        router = (ROOT / 'src/hooks/useRouter.tsx').read_text()
        transition = (ROOT / 'src/components/PageTransition.tsx').read_text()
        motion = (ROOT / 'src/styles/motion.css').read_text()
        self.assertIn('PAGE_TRANSITION_COVER_MS', timing_text)
        self.assertIn('PAGE_TRANSITION_REVEAL_MS', timing_text)
        self.assertIn("from '../lib/motionTimings'", router)
        self.assertIn("from '../lib/motionTimings'", transition)
        self.assertNotIn('const COVER_MS =', router)
        self.assertNotIn('const REVEAL_MS =', router)
        self.assertIn('--transition-cover-ms', transition)
        self.assertIn('--transition-reveal-ms', transition)
        self.assertIn('var(--transition-cover-ms', motion)
        self.assertIn('var(--transition-reveal-ms', motion)
        self.assertNotIn('transition-cover 430ms', motion)
        self.assertNotIn('transition-reveal 650ms', motion)

    def test_mobile_navigation_remains_persistent_after_leaving_the_hero(self):
        responsive = (ROOT / 'src/styles/responsive.css').read_text().replace(' ', '')
        self.assertNotIn('.site-nav{position:absolute}', responsive)
        self.assertIn('.site-nav{position:fixed}', responsive)
        self.assertIn('.site-nav[data-scrolled=true]', responsive)

    def test_optical_media_clears_mouse_offsets_when_touch_takes_over(self):
        optical = (ROOT / 'src/components/OpticalMedia.tsx').read_text()
        self.assertIn('onPointerDown={handlePointerDown}', optical)
        self.assertIn("event.pointerType === 'touch'", optical)
        self.assertIn('reset()', optical)

    def test_mobile_menu_inerts_the_real_footer_element(self):
        nav = (ROOT / 'src/marketing/Nav.tsx').read_text()
        self.assertIn("document.querySelector<HTMLElement>('.footer')", nav)
        self.assertNotIn("document.querySelector<HTMLElement>('.site-footer')", nav)

    def test_static_renderer_supports_route_and_width_filters_for_reproducible_batches(self):
        renderer = (ROOT / 'scripts/render_multipage_qa.py').read_text()
        self.assertIn('argparse', renderer)
        self.assertIn('--route', renderer)
        self.assertIn('--width', renderer)
        self.assertIn('selected_routes', renderer)
        self.assertIn('selected_widths', renderer)

    def test_asset_collections_widen_optional_responsive_fields_for_typescript(self):
        cloud = (ROOT / 'src/marketing/Cloud.tsx').read_text()
        teasers = (ROOT / 'src/marketing/RouteTeasers.tsx').read_text()
        self.assertIn('type AtmoraAsset', cloud)
        self.assertIn('AtmoraAsset', teasers)
        self.assertIn('readonly CloudStory[]', cloud)
        self.assertIn('readonly RouteTeaserChapter[]', teasers)
        self.assertIn('asset?: AtmoraAsset', teasers)

    def test_navigation_closes_on_route_remount_without_sync_effect_state(self):
        app = (ROOT / 'src/App.tsx').read_text()
        nav = (ROOT / 'src/marketing/Nav.tsx').read_text()
        self.assertIn('<Nav key={route.path}/>', app)
        effect_start = nav.find('useEffect(() => {')
        effect_end = nav.find('}, [])', effect_start)
        self.assertNotEqual(effect_start, -1)
        self.assertNotEqual(effect_end, -1)
        scroll_effect = nav[effect_start:effect_end]
        self.assertNotIn('setOpen(false)', scroll_effect)

    def test_router_effect_dependencies_are_lint_clean_and_system_chromium_is_supported(self):
        router = (ROOT / 'src/hooks/useRouter.tsx').read_text()
        config = (ROOT / 'playwright.config.ts').read_text()
        self.assertIn('applyRuntimeRouteMeta(route)', router)
        self.assertIn('}, [route])', router)
        self.assertIn('ATMORA_CHROMIUM_PATH', config)
        self.assertIn('ATMORA_CHROMIUM_ONLY', config)
        self.assertIn('executablePath', config)


if __name__ == '__main__':
    unittest.main()
