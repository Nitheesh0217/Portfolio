// AIAssistantScene.swift
// Streaming chat with an ornament Send button.

import SwiftUI

struct AIAssistantScene: View {
    @State private var vm = AIAssistantViewModel()
    @FocusState private var focused: Bool

    var body: some View {
        VStack(spacing: 0) {
            SpatialNavBar(title: "AI Assistant",
                          subtitle: "Ask me about Nitheesh's portfolio")

            // Transcript
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: Spacing.md) {
                        ForEach(vm.messages.filter { $0.role != .system }) { msg in
                            messageBubble(msg).id(msg.id)
                        }
                    }
                    .padding(Spacing.lg)
                }
                .onChange(of: vm.messages) { _, _ in
                    if let last = vm.messages.last { withAnimation { proxy.scrollTo(last.id) } }
                }
            }

            // Input row
            HStack(spacing: Spacing.sm) {
                TextField("Ask a question…", text: $vm.draft, axis: .vertical)
                    .textFieldStyle(.plain)
                    .font(Typography.body)
                    .focused($focused)
                    .padding(Spacing.md)
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: AppTheme.Radius.md))
                    .lineLimit(1...5)
                    .onSubmit { Task { await vm.send() } }

                Button {
                    Task { await vm.send() }
                } label: {
                    Image(systemName: vm.isStreaming ? "stop.fill" : "arrow.up")
                        .font(.system(size: 18, weight: .bold))
                        .frame(width: 44, height: 44)
                        .background(AppTheme.Accent.primary, in: Circle())
                        .foregroundStyle(.white)
                }
                .buttonStyle(.plain)
                .hoverEffect(.lift)
                .disabled(vm.draft.isEmpty)
            }
            .padding(Spacing.md)
            .background(.regularMaterial)
        }
        .background(AppTheme.GlassMaterial.panel)
        .onAppear { focused = true }
    }

    @ViewBuilder
    private func messageBubble(_ msg: AIAssistantViewModel.Message) -> some View {
        HStack {
            if msg.role == .user { Spacer(minLength: 60) }
            Text(msg.text)
                .font(Typography.body)
                .foregroundStyle(.primary)
                .padding(Spacing.md)
                .background(
                    msg.role == .user ? AnyShapeStyle(AppTheme.Accent.primary.opacity(0.25))
                                      : AnyShapeStyle(.ultraThinMaterial),
                    in: RoundedRectangle(cornerRadius: AppTheme.Radius.lg)
                )
            if msg.role == .assistant { Spacer(minLength: 60) }
        }
    }
}

#Preview("AI") {
    AIAssistantScene().frame(width: 760, height: 820)
}
