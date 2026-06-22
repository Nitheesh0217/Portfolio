// ContentView.swift
// Kept for Xcode template compatibility — App declares scenes directly.

import SwiftUI

struct ContentView: View {
    var body: some View {
        WelcomeScene().environment(PortfolioViewModel())
    }
}

#Preview { ContentView() }
