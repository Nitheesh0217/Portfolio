// NitheeshPortfolioApp.swift
// @main App — declares every scene in the portfolio.
// visionOS 2026 / Swift 5.9+

import SwiftUI

@main
struct NitheeshPortfolioApp: App {

    @State private var portfolio = PortfolioViewModel()

    @AppStorage("selectedPersona") private var personaRaw: String = Persona.recruiter.rawValue

    var body: some Scene {

        // MARK: Root window — Welcome / About
        WindowGroup("Welcome", id: "welcome") {
            WelcomeScene()
                .environment(portfolio)
        }
        .windowStyle(.plain)
        .defaultSize(width: 900, height: 620)

        // MARK: Projects gallery (handles its own detail in-window)
        WindowGroup("Projects", id: "projects") {
            ProjectsScene()
                .environment(portfolio)
        }
        .windowStyle(.plain)
        .defaultSize(width: 1100, height: 680)

        // MARK: Skills (flat overview — immersive variant below)
        WindowGroup("Skills", id: "skills") {
            SkillsScene()
                .environment(portfolio)
        }
        .defaultSize(width: 900, height: 700)

        // MARK: Immersive Skills space
        ImmersiveSpace(id: "skills-immersive") {
            ImmersiveSpaceScene()
                .environment(portfolio)
        }
        .immersionStyle(selection: .constant(.mixed), in: .mixed)

        // MARK: Timeline
        WindowGroup("Timeline", id: "timeline") {
            TimelineScene()
                .environment(portfolio)
        }
        .defaultSize(width: 900, height: 1100)

        // MARK: Terminal
        WindowGroup("Terminal", id: "terminal") {
            TerminalScene()
                .environment(portfolio)
        }
        .defaultSize(width: 820, height: 540)

        // MARK: AI Assistant
        WindowGroup("AI Assistant", id: "ai-assistant") {
            AIAssistantScene()
                .environment(portfolio)
        }
        .defaultSize(width: 760, height: 820)

        // MARK: Certificates
        WindowGroup("Certificates", id: "certificates") {
            CertificatesScene()
                .environment(portfolio)
        }
        .defaultSize(width: 1100, height: 780)

        // MARK: Recruiter
        WindowGroup("Recruiter", id: "recruiter") {
            RecruiterScene()
                .environment(portfolio)
        }
        .defaultSize(width: 1200, height: 820)

        // MARK: Freelance
        WindowGroup("Freelance", id: "freelance") {
            FreelanceScene()
                .environment(portfolio)
        }
        .defaultSize(width: 900, height: 720)
    }
}
