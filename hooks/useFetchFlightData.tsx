import { useState, useEffect } from "react";

interface FlightData {
  flight_status: string;
  departure_iata: string;
  arrival_iata: string;
  departure_scheduled: string;
  arrival_scheduled: string;
}

export const useFetchFlightData = (
  flightCode: string,
  flightNumber: string,
  flightDate: string
) => {
  const [data, setData] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlightData = async () => {
      if (!flightCode || !flightNumber || !flightDate) return;

      setLoading(true);
      setError(null);

      try {
        const apiKey = "eac2405b5b66c68404d28e82a02e3e31";
        const response = await fetch(
          `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&airline_iata=${flightCode}&flight_number=${flightNumber}&flight_date=${flightDate}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch flight data");
        }

        const result = await response.json();
        const flight = result.data[0]; // Assuming you're fetching one flight

        if (flight) {
          setData({
            flight_status: flight.flight_status,
            departure_iata: flight.departure.iata,
            arrival_iata: flight.arrival.iata,
            departure_scheduled: flight.departure.scheduled,
            arrival_scheduled: flight.arrival.scheduled,
          });
        } else {
          setError("No flight data found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightData();
  }, [flightCode, flightNumber, flightDate]);

  return { data, loading, error };
};
