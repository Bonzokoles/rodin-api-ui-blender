"use client"

import { useEffect, useState, useRef } from "react"
import { useThree } from "@react-three/fiber"
import { useGLTF, Center } from "@react-three/drei"
import LoadingSpinner from "./loading-spinner"
import * as THREE from "three"

export default function ModelComponent({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { scene } = useGLTF(url, undefined, undefined, (error) => {
    console.error("Error loading model:", error)
    setError(`Failed to load model: ${error.message}`)
    setIsLoading(false)
  })
  const { camera } = useThree()
  const modelRef = useRef<THREE.Group>(null)
  const dotsRef = useRef<THREE.Group>(null)

  useEffect(() => {
    // Reset camera position when model changes - position higher to account for prompt container
    camera.position.set(0, 0, 5)

    // Set loading to false when scene is loaded
    if (scene) {
      setIsLoading(false)

      // Apply white wireframe material to all meshes
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.material) {
          // Handle different material types (single material or array of materials)
          let originalMaterial: THREE.Material

          if (Array.isArray(object.material)) {
            // If it's an array, use the first material as base
            const firstMaterial = object.material[0]
            originalMaterial = firstMaterial?.clone ? firstMaterial.clone() : firstMaterial
          } else {
            // Single material - check if it has clone method
            originalMaterial = object.material.clone ? object.material.clone() : object.material
          }

          // Ensure we have a valid material and set transparency
          if (originalMaterial) {
            originalMaterial.transparent = true
            originalMaterial.opacity = 0.3
          }

          // Create a wireframe material
          const wireframeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.7,
          })

          // Set the material to an array containing both materials
          object.material = originalMaterial ? [originalMaterial, wireframeMaterial] : [wireframeMaterial]
        }
      })
    }

    return () => {
      setIsLoading(true)
    }
  }, [url, camera, scene])

  return isLoading ? (
    <LoadingSpinner />
  ) : error ? (
    <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  ) : (
    <Center>
      <primitive ref={modelRef} object={scene} scale={1.5} />
    </Center>
  )
}
