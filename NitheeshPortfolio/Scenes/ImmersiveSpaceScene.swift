// ImmersiveSpaceScene.swift
// The ONE immersive scene — floating skill orbs around the viewer.
// .mixed style: passthrough preserved, content layered in 3D.

import SwiftUI
import RealityKit

struct ImmersiveSpaceScene: View {
    @Environment(PortfolioViewModel.self) private var portfolio
    @Environment(\.dismissImmersiveSpace) private var dismissImmersive

    var body: some View {
        RealityView { content in
            let root = Entity()
            content.add(root)

            // Lay out skill orbs on a sphere around the viewer.
            let skills = portfolio.skills
            let radius: Float = 1.8
            for (i, skill) in skills.enumerated() {
                let theta = Float(i) / Float(skills.count) * 2 * .pi
                let phi: Float = .pi / 2 + Float.random(in: -0.35...0.35)

                let x = radius * sin(phi) * cos(theta)
                let y = 1.5 + radius * cos(phi) * 0.6
                let z = radius * sin(phi) * sin(theta) - 1.0

                let orb = ModelEntity(
                    mesh: .generateSphere(radius: 0.08),
                    materials: [SimpleMaterial(color: .init(red: 0.0, green: 0.7, blue: 0.7, alpha: 0.85),
                                               roughness: 0.2,
                                               isMetallic: false)]
                )
                orb.position = SIMD3(x, y, z)
                orb.name = skill.name
                orb.components.set(InputTargetComponent())
                orb.components.set(CollisionComponent(shapes: [.generateSphere(radius: 0.08)]))
                root.addChild(orb)

                // Label
                let label = ModelEntity(
                    mesh: .generateText(skill.name,
                                        extrusionDepth: 0.002,
                                        font: .systemFont(ofSize: 0.05, weight: .semibold),
                                        containerFrame: .zero,
                                        alignment: .center,
                                        lineBreakMode: .byTruncatingTail),
                    materials: [SimpleMaterial(color: .white, isMetallic: false)]
                )
                label.position = SIMD3(x, y - 0.14, z)
                label.look(at: SIMD3(0, 1.5, 0), from: label.position, relativeTo: nil)
                root.addChild(label)
            }
        } update: { _ in }
        .gesture(
            TapGesture().onEnded {
                Task {
                    await dismissImmersive()
                    portfolio.isImmersiveSpaceOpen = false
                }
            }
        )
    }
}
