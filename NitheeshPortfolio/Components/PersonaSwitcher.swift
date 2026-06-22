// PersonaSwitcher.swift
// Switches persona → reorders featured scenes. Persisted via @AppStorage.

import SwiftUI

struct PersonaSwitcher: View {
    @Environment(PortfolioViewModel.self) private var portfolio
    @AppStorage("selectedPersona") private var personaRaw: String = Persona.recruiter.rawValue
    @Environment(\.openWindow) private var openWindow

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.md) {
            Text("Who are you?")
                .font(Typography.title3)
            Text("Pick a persona — the app will surface the most useful windows first.")
                .font(Typography.footnote)
                .foregroundStyle(.secondary)

            ForEach(Persona.allCases) { persona in
                Button {
                    personaRaw = persona.rawValue
                    portfolio.persona = persona
                    // Open the first featured window for this persona.
                    if let first = persona.featuredScenes.first, first != "skills-immersive" {
                        openWindow(id: first)
                    }
                } label: {
                    HStack(spacing: Spacing.sm) {
                        Image(systemName: persona.symbol)
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundStyle(persona == portfolio.persona ? AppTheme.Accent.primary : .secondary)
                            .frame(width: 32)
                        VStack(alignment: .leading) {
                            Text(persona.label).font(Typography.callout)
                            Text(persona.featuredScenes.joined(separator: " · "))
                                .font(Typography.caption)
                                .foregroundStyle(.secondary)
                        }
                        Spacer()
                        if persona == portfolio.persona {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(AppTheme.Accent.primary)
                        }
                    }
                    .padding(Spacing.sm)
                    .background(
                        persona == portfolio.persona ? AnyShapeStyle(.regularMaterial) : AnyShapeStyle(.clear),
                        in: RoundedRectangle(cornerRadius: AppTheme.Radius.md)
                    )
                }
                .buttonStyle(.plain)
                .hoverEffect(.highlight)
            }
        }
    }
}
