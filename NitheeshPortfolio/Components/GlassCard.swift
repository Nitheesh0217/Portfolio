// GlassCard.swift
// Reusable glass panel. Use everywhere a panel/card is needed.

import SwiftUI

struct GlassCard<Content: View>: View {
    var material: Material         = AppTheme.GlassMaterial.card
    var cornerRadius: CGFloat      = AppTheme.Radius.lg
    var padding: CGFloat           = Spacing.lg
    @ViewBuilder var content: () -> Content

    @State private var isHovered = false

    var body: some View {
        content()
            .padding(padding)
            .background(material, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(.white.opacity(0.08), lineWidth: 1)
            )
            .hoverEffect(.highlight)
            .shadow(
                color: AppTheme.panelShadow.color,
                radius: AppTheme.panelShadow.radius,
                x: AppTheme.panelShadow.x,
                y: AppTheme.panelShadow.y
            )
    }
}

#Preview("GlassCard") {
    GlassCard {
        VStack(alignment: .leading, spacing: Spacing.xs) {
            Text("Coach Jake").font(Typography.title2)
            Text("AI fitness coach").font(Typography.body).foregroundStyle(.secondary)
        }
    }
    .frame(width: 400)
    .padding(Spacing.xl)
}
