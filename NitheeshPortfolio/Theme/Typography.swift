// Typography.swift
// SF Pro Display for headings, SF Pro Text for body.
// All sizes respect Dynamic Type.

import SwiftUI

enum Typography {

    // Headings — SF Pro Display
    static let hero      = Font.system(size: 64, weight: .black,    design: .default).leading(.tight)
    static let title1    = Font.system(size: 40, weight: .bold,     design: .default)
    static let title2    = Font.system(size: 28, weight: .bold,     design: .default)
    static let title3    = Font.system(size: 22, weight: .semibold, design: .default)

    // Body — SF Pro Text
    static let bodyLarge = Font.system(size: 19, weight: .regular,  design: .default)
    static let body      = Font.system(size: 17, weight: .regular,  design: .default)
    static let callout   = Font.system(size: 15, weight: .medium,   design: .default)
    static let footnote  = Font.system(size: 13, weight: .regular,  design: .default)
    static let caption   = Font.system(size: 12, weight: .medium,   design: .default)

    // Mono — Terminal
    static let mono      = Font.system(size: 14, weight: .regular,  design: .monospaced)
}
