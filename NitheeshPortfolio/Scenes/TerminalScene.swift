// TerminalScene.swift
// Toy terminal that responds to a few canned commands about the portfolio.

import SwiftUI

struct TerminalScene: View {
    @State private var input: String = ""
    @State private var lines: [Line] = [
        .system("nitheesh-os v2.0 — type 'help' for commands"),
        .system("───────────────────────────────────────"),
    ]
    @FocusState private var focused: Bool

    struct Line: Identifiable, Hashable {
        let id = UUID()
        let kind: Kind
        let text: String
        enum Kind { case system, prompt, output }
        static func system(_ s: String)  -> Line { .init(kind: .system, text: s) }
        static func prompt(_ s: String)  -> Line { .init(kind: .prompt, text: s) }
        static func output(_ s: String)  -> Line { .init(kind: .output, text: s) }
    }

    var body: some View {
        VStack(spacing: 0) {
            SpatialNavBar(title: "Terminal", subtitle: "interactive shell")

            ScrollViewReader { proxy in
                ScrollView {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(lines) { line in
                            Text(line.text)
                                .font(Typography.mono)
                                .foregroundStyle(color(for: line.kind))
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .id(line.id)
                        }
                    }
                    .padding(Spacing.md)
                }
                .onChange(of: lines) { _, _ in
                    if let last = lines.last { withAnimation { proxy.scrollTo(last.id) } }
                }
            }

            HStack(spacing: Spacing.xs) {
                Text("$").font(Typography.mono).foregroundStyle(AppTheme.Accent.primary)
                TextField("type a command", text: $input)
                    .textFieldStyle(.plain)
                    .font(Typography.mono)
                    .focused($focused)
                    .onSubmit(run)
            }
            .padding(Spacing.md)
            .background(.regularMaterial)
        }
        .background(AppTheme.GlassMaterial.panel)
        .onAppear { focused = true }
    }

    private func color(for kind: Line.Kind) -> Color {
        switch kind {
        case .system: .secondary
        case .prompt: AppTheme.Accent.primary
        case .output: .primary
        }
    }

    private func run() {
        let cmd = input.trimmingCharacters(in: .whitespaces)
        guard !cmd.isEmpty else { return }
        lines.append(.prompt("$ \(cmd)"))
        input = ""

        switch cmd.lowercased() {
        case "help":
            lines.append(.output("commands: about, skills, contact, projects, clear"))
        case "about":
            lines.append(.output("\(PortfolioContent.fullName) — \(PortfolioContent.title)"))
            lines.append(.output(PortfolioContent.tagline))
        case "skills":
            lines.append(.output("React, Next.js, TypeScript, Node, Python, SQL, Snowflake, AWS, SwiftUI"))
        case "contact":
            lines.append(.output(PortfolioContent.email))
        case "projects":
            for p in MockData.projects { lines.append(.output("• \(p.name) — \(p.tagline)")) }
        case "clear":
            lines = [.system("nitheesh-os v2.0 — type 'help' for commands")]
        default:
            lines.append(.output("unknown command: \(cmd)"))
        }
    }
}

#Preview("Terminal") {
    TerminalScene().frame(width: 820, height: 540)
}
