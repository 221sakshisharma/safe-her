"use client"

import { useState, useEffect, useCallback } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  loading: boolean
  error: string | null
}

const DEFAULT_LOCATION = {
  latitude: 28.6139, // New Delhi as fallback
  longitude: 77.209,
}

export function useGeolocation(watch = true) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
  })

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      loading: false,
      error: null,
    })
  }, [])

  const onError = useCallback((error: GeolocationPositionError) => {
    setState((prev) => ({
      ...prev,
      latitude: prev.latitude ?? DEFAULT_LOCATION.latitude,
      longitude: prev.longitude ?? DEFAULT_LOCATION.longitude,
      loading: false,
      error: error.message,
    }))
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        latitude: DEFAULT_LOCATION.latitude,
        longitude: DEFAULT_LOCATION.longitude,
        accuracy: null,
        loading: false,
        error: "Geolocation is not supported by this browser.",
      })
      return
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options)

    // Optionally watch for position changes
    let watchId: number | undefined
    if (watch) {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, options)
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watch, onSuccess, onError])

  return {
    ...state,
    lat: state.latitude ?? DEFAULT_LOCATION.latitude,
    lng: state.longitude ?? DEFAULT_LOCATION.longitude,
    hasLocation: state.latitude !== null && state.error === null,
  }
}
