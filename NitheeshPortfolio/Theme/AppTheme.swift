// AppTheme.swift
// Design tokens — materials, colors, radii, depth.
// Single source of truth. No hardcoded hex values anywhere else.

import SwiftUI

enum AppTheme {

    // MARK: Materials
    // Use semantic materials only — visionOS renders them correctly in any lighting.
    enum GlassMaterial {
        /// Main window background. Strongest blur, max content legibility.
        static let panel: Material = .regularMaterial
        /// Nested cards inside a panel. Lighter so the parent still reads as a layer.
        static let card: Material = .ultraThinMaterial
        /// Sticky chrome (ornaments, toolbars). Slightly opaque for affordance.
        static let chrome: Material = .thickMaterial
    }

    // MARK: Accent — single teal accent, no gradients
    enum Accent {
        static let primary: Color = .teal           // CTAs, active states
        static let success: Color = .green          // "Open to work" pulse
        static let muted: Color   = .secondary      // de-emphasized
    }

    // MARK: Corner Radius (Apple 4pt rhythm)
    enum Radius {
        static let xs: CGFloat = 8
        static let sm: CGFloat = 12
        static let md: CGFloat = 16
        static let lg: CGFloat = 20
        static let xl: CGFloat = 28
        static let pill: CGFloat = 999
    }

    // MARK: Depth (z-translation for layered panels in 3D space)
    enum Depth {
        static let resting: CGFloat = 0
        static let hovered: CGFloat = 8        // mm forward on hover
        static let focused: CGFloat = 16       // mm forward when focused
    }

    // MARK: Shadow stack (for non-volumetric depth illusion on flat panels)
    static let panelShadow = (color: Color.black.opacity(0.35), radius: 32.0, x: 0.0, y: 12.0)
}
