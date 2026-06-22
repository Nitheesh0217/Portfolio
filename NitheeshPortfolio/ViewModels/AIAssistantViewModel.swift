// AIAssistantViewModel.swift
// Streaming chat about Nitheesh's portfolio.
// TODO: wire to a real backend (Anthropic/OpenAI) — placeholder echoes for now.

import Foundation
import Observation

@Observable
final class AIAssistantViewModel {

    struct Message: Identifiable, Hashable {
        let id = UUID()
        let role: Role
        var text: String
        let timestamp: Date = .now
        enum Role { case user, assistant, system }
    }

    var messages: [Message] = [
        .init(role: .system, text: """
        You are an AI assistant representing Nitheesh Donepudi's portfolio. Answer questions about \
        his skills, projects, experience, and availability for full-time SWE / Data Engineering roles.
        """)
    ]

    var isStreaming = false
    var draft: String = ""

    // TODO: Replace with real API call (Anthropic Messages or OpenAI Responses).
    func send() async {
        let trimmed = draft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty, !isStreaming else { return }

        messages.append(.init(role: .user, text: trimmed))
        draft = ""
        isStreaming = true

        // Placeholder echo (will be replaced by real streaming endpoint)
        let reply = "Demo reply — wire `AIAssistantViewModel.send()` to your inference API."
        var partial = ""
        for token in reply.split(separator: " ") {
            try? await Task.sleep(nanoseconds: 80_000_000)
            partial += (partial.isEmpty ? "" : " ") + token
            if let last = messages.last, last.role == .assistant {
                messages[messages.count - 1].text = partial
            } else {
                messages.append(.init(role: .assistant, text: partial))
            }
        }
        isStreaming = false
    }
}
