// WelcomeScene.swift
// Scene Type: WindowGroup (standard visionOS window with glass chrome)
// Mimics: a floating browser-style window showing portfolio homepage
// Reference: openning-main-page.jpg — dark glass window frame, hero layout,
//            pill resize handle, floating in real space

import SwiftUI
import RealityKit

// MARK: - Scene Declaration (in App entry)
// WindowGroup("Welcome", id: "welcome") { WelcomeScene() }
//   .defaultSize(width: 900, height: 620, depth: 0, in: .meters)
//   .windowStyle(.plain)
//   .defaultWorldScaling(.dynamic)

// MARK: - Main Scene
struct WelcomeScene: View {

    @Environment(\.openWindow) private var openWindow
    @Environment(\.dismissWindow) private var dismissWindow
    @State private var isHoveringCTA = false
    @State private var isHoveringGitHub = false
    @State private var isHoveringLinkedIn = false
    @State private var isHoveringResume = false
    @State private var appeared = false

    var body: some View {
        ZStack {
            // ── Background gradient (dark, like Dotdive reference)
            LinearGradient(
                colors: [
                    Color(white: 0.06),
                    Color(white: 0.10),
                    Color(white: 0.07)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            // ── Subtle noise grain overlay
            Rectangle()
                .fill(.ultraThinMaterial)
                .blendMode(.overlay)
                .opacity(0.08)
                .ignoresSafeArea()

            HStack(spacing: 0) {
                // ── LEFT: Hero Text Block
                heroTextBlock
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.leading, 52)

                // ── RIGHT: Hero Image + Social Proof
                heroVisualBlock
                    .frame(maxWidth: .infinity)
                    .padding(.trailing, 36)
            }
            .padding(.vertical, 48)
        }
        .frame(minWidth: 800, minHeight: 560)
        .glassBackgroundEffect() // visionOS native glass window
        .ornament(
            attachmentAnchor: .scene(.bottom)
        ) {
            navigationOrnament
        }
        .onAppear {
            withAnimation(.spring(duration: 0.9, bounce: 0.2).delay(0.15)) {
                appeared = true
            }
        }
    }

    // MARK: - Hero Text Block (LEFT)
    private var heroTextBlock: some View {
        VStack(alignment: .leading, spacing: 20) {

            // Status badge
            statusBadge

            // Name
            Text("Nitheesh Donepudi")
                .font(.system(size: 42, weight: .bold, design: .default))
                .fontDesign(.rounded)
                .foregroundStyle(.white)
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 18)
                .animation(.spring(duration: 0.7).delay(0.1), value: appeared)

            // Title
            Text("Full-Stack Engineer\n& Data Engineer")
                .font(.system(size: 28, weight: .semibold))
                .foregroundStyle(.white.opacity(0.85))
                .lineSpacing(4)
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 14)
                .animation(.spring(duration: 0.7).delay(0.2), value: appeared)

            // Location / Status row
            locationStatusRow

            Spacer().frame(height: 8)

            // CTA Button
            ctaButton

            Spacer().frame(height: 16)

            // Link buttons row
            linkButtonsRow
        }
    }

    // MARK: - Status Badge
    private var statusBadge: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(Color.green)
                .frame(width: 8, height: 8)
                .shadow(color: .green.opacity(0.8), radius: 4)
            Text("Open to work · STEM OPT")
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(.green)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(.green.opacity(0.12), in: Capsule())
        .overlay(Capsule().stroke(.green.opacity(0.3), lineWidth: 1))
        .opacity(appeared ? 1 : 0)
        .animation(.spring(duration: 0.6).delay(0.05), value: appeared)
    }

    // MARK: - Location + Status Row
    private var locationStatusRow: some View {
        HStack(spacing: 16) {
            Label("Miramar, FL", systemImage: "location.fill")
                .font(.system(size: 14, weight: .regular))
                .foregroundStyle(.white.opacity(0.6))

            Divider()
                .frame(height: 14)
                .overlay(.white.opacity(0.2))

            Label("Full-Time / Contract", systemImage: "briefcase.fill")
                .font(.system(size: 14, weight: .regular))
                .foregroundStyle(.white.opacity(0.6))
        }
        .opacity(appeared ? 1 : 0)
        .animation(.spring(duration: 0.7).delay(0.3), value: appeared)
    }

    // MARK: - CTA Button  ("Get Connected" in reference)
    private var ctaButton: some View {
        Button {
            openWindow(id: "contact")
        } label: {
            HStack(spacing: 8) {
                Text("Let's Connect")
                    .font(.system(size: 16, weight: .semibold))
                Image(systemName: "arrow.right")
                    .font(.system(size: 14, weight: .semibold))
            }
            .foregroundStyle(.black)
            .padding(.horizontal, 28)
            .padding(.vertical, 14)
            .background(
                isHoveringCTA
                    ? Color.white
                    : Color(white: 0.92),
                in: Capsule()
            )
            .shadow(
                color: .white.opacity(isHoveringCTA ? 0.25 : 0.10),
                radius: isHoveringCTA ? 16 : 6
            )
            .scaleEffect(isHoveringCTA ? 1.04 : 1.0)
        }
        .buttonStyle(.plain)
        .hoverEffect(.lift)
        .onHover { isHoveringCTA = $0 }
        .animation(.spring(duration: 0.25), value: isHoveringCTA)
        .opacity(appeared ? 1 : 0)
        .animation(.spring(duration: 0.7).delay(0.35), value: appeared)
    }

    // MARK: - GitHub / LinkedIn / Resume links
    private var linkButtonsRow: some View {
        HStack(spacing: 12) {
            linkChip(
                label: "GitHub",
                icon: "chevron.left.forwardslash.chevron.right",
                isHovering: $isHoveringGitHub
            ) {
                openURL("https://github.com/Nitheesh0217")
            }
            linkChip(
                label: "LinkedIn",
                icon: "person.crop.square.filled.and.at.rectangle",
                isHovering: $isHoveringLinkedIn
            ) {
                openURL("https://linkedin.com/in/nitheesh-donepudi")
            }
            linkChip(
                label: "Resume",
                icon: "doc.text.fill",
                isHovering: $isHoveringResume
            ) {
                openURL("https://nitheesh.dev/resume")
            }
        }
        .opacity(appeared ? 1 : 0)
        .animation(.spring(duration: 0.7).delay(0.42), value: appeared)
    }

    private func linkChip(
        label: String,
        icon: String,
        isHovering: Binding<Bool>,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 13))
                Text(label)
                    .font(.system(size: 13, weight: .medium))
            }
            .foregroundStyle(isHovering.wrappedValue ? .white : .white.opacity(0.7))
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(
                isHovering.wrappedValue
                    ? .white.opacity(0.15)
                    : .white.opacity(0.07),
                in: Capsule()
            )
            .overlay(
                Capsule()
                    .stroke(.white.opacity(isHovering.wrappedValue ? 0.4 : 0.15), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
        .hoverEffect(.highlight)
        .onHover { isHovering.wrappedValue = $0 }
        .animation(.spring(duration: 0.2), value: isHovering.wrappedValue)
    }

    // MARK: - Hero Visual Block (RIGHT)
    private var heroVisualBlock: some View {
        VStack(alignment: .trailing, spacing: 24) {

            // Profile photo placeholder (replace with AsyncImage / your photo)
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color.teal.opacity(0.4), Color.blue.opacity(0.2)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 220, height: 220)
                    .shadow(color: .teal.opacity(0.3), radius: 32)

                // Replace with: AsyncImage(url: URL(string: "your-photo-url"))
                Image(systemName: "person.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100)
                    .foregroundStyle(.white.opacity(0.5))
            }
            .scaleEffect(appeared ? 1 : 0.85)
            .opacity(appeared ? 1 : 0)
            .animation(.spring(duration: 0.9, bounce: 0.3).delay(0.2), value: appeared)

            // Social Proof row (like the avatar row in reference)
            socialProofRow
        }
        .frame(maxHeight: .infinity, alignment: .center)
    }

    // MARK: - Social Proof (like ★ 4.9 · Trusted by... in the reference)
    private var socialProofRow: some View {
        HStack(spacing: 10) {
            // Mini avatars stack
            HStack(spacing: -10) {
                ForEach(0..<3) { i in
                    Circle()
                        .fill(Color(white: Double(i) * 0.1 + 0.3))
                        .frame(width: 28, height: 28)
                        .overlay(Circle().stroke(.white.opacity(0.3), lineWidth: 1.5))
                }
            }

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 2) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 11))
                        .foregroundStyle(.yellow)
                    Text("5.0 on LinkedIn")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(.white)
                }
                Text("Endorsed by 10+ engineers")
                    .font(.system(size: 11))
                    .foregroundStyle(.white.opacity(0.5))
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(.white.opacity(0.06), in: RoundedRectangle(cornerRadius: 14))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(.white.opacity(0.12), lineWidth: 1))
        .opacity(appeared ? 1 : 0)
        .animation(.spring(duration: 0.7).delay(0.5), value: appeared)
    }

    // MARK: - Bottom Ornament Navigation
    private var navigationOrnament: some View {
        HStack(spacing: 4) {
            ornamentButton("house.fill",        label: "Home")    { }
            ornamentButton("folder.fill",        label: "Projects"){ openWindow(id: "projects") }
            ornamentButton("wrench.and.screwdriver", label: "Skills") { openWindow(id: "skills") }
            ornamentButton("clock.fill",         label: "Timeline"){ openWindow(id: "timeline") }
            ornamentButton("sparkle",            label: "AI")     { openWindow(id: "ai-chat") }
            ornamentButton("magnifyingglass",    label: "Search") { openWindow(id: "search") }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .glassBackgroundEffect()
    }

    private func ornamentButton(
        _ icon: String,
        label: String,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .medium))
                    .foregroundStyle(.white.opacity(0.85))
                Text(label)
                    .font(.system(size: 10))
                    .foregroundStyle(.white.opacity(0.5))
            }
            .frame(width: 56, height: 48)
        }
        .buttonStyle(.plain)
        .hoverEffect(.highlight)
    }

    // MARK: - Helper
    // TODO: wire this to @Environment(\.openURL) in the real app
    // (renaming required — env var also called openURL).
    private func openURL(_ string: String) {
        guard URL(string: string) != nil else { return }
    }
}

// MARK: - Preview
#Preview(windowStyle: .plain) {
    WelcomeScene()
        .frame(width: 900, height: 620)
}
