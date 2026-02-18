"use client"

import { useState, useEffect } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  loading: boolean
  error: string | null
}

const DEFAULT_LOCATION = {
  latitude: 28.6669, // Kashmere Gate, Delhi
  longitude: 77.229,
}

export function useGeolocation(watch = true) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Geolocation is temporarily disabled; use a fixed location across the app.
    setState({
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude,
      accuracy: null,
      loading: false,
      error: null,
    })

    // const options: PositionOptions = {
    //   enableHighAccuracy: true,
    //   timeout: 10000,
    //   maximumAge: 30000,
    // }
    //
    // // Get initial position
    // navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
    //
    // // Optionally watch for position changes
    // let watchId: number | undefined
    // if (watch) {
    //   watchId = navigator.geolocation.watchPosition(onSuccess, onError, options)
    // }
    //
    // return () => {
    //   if (watchId !== undefined) {
    //     navigator.geolocation.clearWatch(watchId)
    //   }
    // }
  }, [watch])

  return {
    ...state,
    lat: state.latitude ?? DEFAULT_LOCATION.latitude,
    lng: state.longitude ?? DEFAULT_LOCATION.longitude,
    hasLocation: state.latitude !== null && state.error === null,
  }
}
