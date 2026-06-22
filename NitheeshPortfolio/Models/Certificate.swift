// Certificate.swift
import Foundation

struct Certificate: Identifiable, Hashable {
    let id = UUID()
    let title: String
    let issuer: String
    let earned: Date
    let verifyURL: URL?
    let symbol: String          // SF Symbol
}
