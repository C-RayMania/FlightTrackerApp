import FlightInfoModal from "@/components/FlightInfoModal";
import SearchBar from "@/components/SearchBar";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const App: React.FC = () => {
  const [flightCode, setFlightCode] = useState<string>("");
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [flightDate, setFlightDate] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [flightInfo, setFlightInfo] = useState<any>(null);
  const [searchedFlights, setSearchedFlights] = useState<any[]>([]); // IMPORTANT: Fix local storage functionality
  const [aircraftManufacturer, setAircraftManufacturer] = useState<string>("Unknown");
  const [aircraftType, setAircraftType] = useState<string>("Unknown");
  const [loading, setLoading] = useState<boolean>(false);

  const apiKey = "4043aa158c27c399be378c7db629f0f9";
  const weatherKey = "PFu5xgsh2voHfbohtQTWaQCh1jnB4RAv";

  const handleSearchFCode = (text: string) => {
    setFlightCode(text);
  };

  const handleSearchFNumber = (text: string) => {
    setFlightNumber(text);
  };

  const handleSearchDate = (text: string) => {
    setFlightDate(text);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric", timeZone: "Europe/London" });
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return "Invalid Time";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/London" });
  };

  const fetchFlightInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&airline_iata=${flightCode}&flight_number=${flightNumber}&limit=1`
      );
      const data = await response.json();

      if (data?.data && data.data.length > 0) {
        const flightData = data.data[0];
        setFlightInfo({
          departureFullWords: flightData.departure.airport || "N/A",
          departureIATA: flightData.departure.iata || "N/A",
          departureICAO: flightData.departure.icao || "--",
          departureTerminalNo: flightData.departure.terminal || "N/A",
          departureTime: flightData.departure.estimated ? formatTime(flightData.departure.estimated) : "N/A",
          departureDelay: flightData.departure.delay || "0",
          gateNumber: flightData.departure.gate || "--",
          arrivalFullWords: flightData.arrival.airport || "N/A",
          arrivalIATA: flightData.arrival.iata || "N/A",
          arrivalICAO: flightData.arrival.icao || "--",
          arrivalTerminalNo: flightData.arrival.terminal || "N/A",
          arrivalTime: flightData.arrival.estimated ? formatTime(flightData.arrival.estimated) : "N/A",
          arrivalDelay: flightData.arrival.delay || "0",
          currentFlightStatus: flightData.flight_status || "N/A",
          baggage: flightData.arrival.baggage || "--",
          aircraftIATA: flightData.aircraft.iata || "Unknown",
          airlineName: flightData.airline.name || "Unknown",
          formattedDepartureDate: flightData.departure.estimated ? formatDate(flightData.departure.estimated) : "N/A",
          formattedArrivalDate: flightData.arrival.estimated ? formatDate(flightData.arrival.estimated) : "N/A",
          aircraftRegistration: flightData.aircraft.registration || "Unknown Manufacturer",
        });

        if (flightData.aircraft.registration) {
          fetchAircraftInfo(flightData.aircraft.registration);
        }

        // Fetch and set city names
        const departureCity = await fetchAirportCityName(flightData.departure.icao);
        const arrivalCity = await fetchAirportCityName(flightData.arrival.icao);

        setDepartureCityName(departureCity);
        setArrivalCityName(arrivalCity);

        // Fetch and set weather details
        const weatherDetails = await fetchWeatherDetails(arrivalCity);
        setArrivalTemperature(`${weatherDetails.temperature}°C`);
        setArrivalPrecipitation(weatherDetails.precipitation);
      } else {
        setFlightInfo(null);
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      setFlightInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const [departureCityName, setDepartureCityName] = useState<string>("");
  const [arrivalCityName, setArrivalCityName] = useState<string>("");

  const fetchAirportCityName = async (icao: string) => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/mwgg/Airports/refs/heads/master/airports.json`
      );
      const data = await response.json();
      return data[icao]?.city || "City not found";
    } catch (error) {
      console.error("Error fetching airport city data:", error);
      return "City not found";
    }
  };

  const fetchAircraftInfo = async (aircraftRegistration: any) => {
    try {
      const response = await fetch(`https://api.adsbdb.com/v0/aircraft/${aircraftRegistration}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Debugging log to check API response
      console.log("Aircraft API response:", data);
  
      if (data?.aircraft) {
        setAircraftManufacturer(data.aircraft.manufacturer || "Unknown");
        setAircraftType(data.aircraft.type || "Unknown");
      } else {
        console.warn("Aircraft data not found in API response");
        setAircraftManufacturer("Unknown");
        setAircraftType("Unknown");
      }
    } catch (error) {
      console.error("Error fetching aircraft info:", error);
      setAircraftManufacturer("Unknown");
      setAircraftType("Unknown");
    }
  };
  

  const handleFetchAircraftData = () => {
    if (flightInfo && flightInfo.aircraftRegistration) {
      const aircraftRegistration = flightInfo.aircraftRegistration; // Access the variable
      fetchAircraftInfo(aircraftRegistration); // Call the function with the value
    } else {
      console.error("Aircraft registration not available");
    }
  };

  const [arrivalTemperature, setArrivalTemperature] = useState<string>("N/A");
  const [arrivalPrecipitation, setArrivalPrecipitation] = useState<string>("N/A");
  const [arrivalWeather, setArrivalWeather] = useState<string>("N/A");


  const fetchWeatherDetails = async (cityName: string) => {

    try {
      // Step 1: Fetch location key for the city
      const locationResponse = await fetch(
        `http://dataservice.accuweather.com/locations/v1/cities/search?q=${cityName}&apikey=${weatherKey}`
      );

      if (!locationResponse.ok) {
        throw new Error(`Error fetching location data: ${locationResponse.status}`);
      }

      const locationData = await locationResponse.json();
      const locationKey = locationData[0]?.Key;

      if (!locationKey) {
        console.error("Location key not found");
        return { temperature: "N/A", precipitation: "N/A" };
      }

      // Step 2: Fetch current weather data
      const weatherResponse = await fetch(
        `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${weatherKey}`
      );

      if (!weatherResponse.ok) {
        throw new Error(`Error fetching weather data: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      const temperature = weatherData[0]?.Temperature?.Metric?.Value || "N/A";
      const precipitation = weatherData[0]?.PrecipitationType || null;
      const weather = weatherData[0]?.WeatherText || "N/A";

      return {
        temperature,
        precipitation: precipitation ? precipitation : "None",
        weather,
      };
    } catch (error) {
      console.error("Error fetching weather details:", error);
      return { temperature: "N/A", precipitation: "Error fetching data" };
    }
  };

  const updateWeather = async () => {
    const weatherDetails = await fetchWeatherDetails(arrivalCityName);
    setArrivalTemperature(weatherDetails.temperature);
    setArrivalPrecipitation(weatherDetails.precipitation);
    setArrivalWeather(weatherDetails.weather);
  };


  const openModal = () => {
    fetchFlightInfo(); // Fetch flight info before opening the modal
    setIsModalVisible(true);
  };

  const closeModal = () => setIsModalVisible(false);
  const fullFlightNumber = flightCode + " " + flightNumber;

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Your Flight:</Text>
      <Text style={styles.mainText}>
        {flightCode || "AA"} {flightNumber || "1234"}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          (!flightCode || !flightNumber) && styles.disabledButton, // Disabled styling
        ]}
        onPress={openModal}
        disabled={!flightCode || !flightNumber} // Button disabled if inputs are empty
      >
        <Text style={[styles.buttonText, (!flightCode || !flightNumber) && styles.disabledButtonText]}>View Flight Info</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#1e90ff" />} {/* Loader */}
      {!loading && flightInfo && <Text style={styles.infoText}>Flight Info Fetched</Text>}

      <SearchBar
        onSearchFCode={handleSearchFCode}
        onSearchFNumber={handleSearchFNumber}
        onSearchDate={handleSearchDate} // Pass the date handler to the SearchBar
      />
      <FlightInfoModal
        visible={isModalVisible}
        onClose={closeModal}
        flightNumberFull={fullFlightNumber}
        departureFullWords={flightInfo?.departureFullWords || ""}
        departureIATA={flightInfo?.departureIATA || ""}
        departureTerminalNo={flightInfo?.departureTerminalNo || ""}
        departureTime={flightInfo?.departureTime || ""}
        gateNumber={flightInfo?.gateNumber || ""}
        arrivalFullWords={flightInfo?.arrivalFullWords || ""}
        arrivalIATA={flightInfo?.arrivalIATA || ""}
        arrivalTerminalNo={flightInfo?.arrivalTerminalNo || ""}
        arrivalTime={flightInfo?.arrivalTime || ""}
        formattedDepartureDate={flightInfo?.formattedDepartureDate || ""}
        flightStatus={flightInfo?.currentFlightStatus || ""}
        baggageClaim={flightInfo?.baggage || ""}
        aircraftIATA={aircraftType || "----"}
        airlineName={flightInfo?.airlineName || ""}
        departureCityName={departureCityName}
        arrivalCityName={arrivalCityName}
        arrivalTemperature={arrivalTemperature}
        arrivalPrecipitation={arrivalPrecipitation}
        aircraftName={aircraftManufacturer || "Unknown Manufacturer"}
        // depDelay={`+${flightInfo?.depDelay}` || "On Time"}
        // arrDelay={`+${flightInfo?.arrDelay}` || "On Time"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  mainText: {
    color: "#fff",
    fontSize: 28,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  disabledButtonText: {
    color: '#aaa'
  },
  infoText: {
    marginTop: 20,
    color: "#fff",
    fontSize: 16,
  },
});

export default App;
