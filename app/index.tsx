import FlightInfoModal from "@/components/FlightInfoModal";
import SearchBar from "@/components/SearchBar";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const App: React.FC = () => {
  const [flightCode, setFlightCode] = useState<string>("");
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [flightDate, setFlightDate] = useState<string>(""); // Added state for flight date
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [flightInfo, setFlightInfo] = useState<any>(null); // State to store flight info
  const apiKey = "eac2405b5b66c68404d28e82a02e3e31";

  const handleSearchFCode = (text: string) => {
    setFlightCode(text);
  };

  const handleSearchFNumber = (text: string) => {
    setFlightNumber(text);
  };

  const handleSearchDate = (text: string) => {
    setFlightDate(text); // Handle date input
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Invalid Date"; // Handle null or undefined
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return "Invalid Time"; // Handle null or undefined
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const fetchFlightInfo = async () => {
    try {
      const response = await fetch(
        `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&airline_iata=${flightCode}&flight_number=${flightNumber}&limit=1`
      );
      const data = await response.json();

      if (data?.data && data.data.length > 0) {
        const flightData = data.data[0]; // Take the first result
        setFlightInfo({
          departureFullWords: flightData.departure.airport || "N/A",
          departureIATA: flightData.departure.iata || "N/A",
          departureTerminalNo: flightData.departure.terminal || "N/A",
          departureTime: flightData.departure.estimated ? formatTime(flightData.departure.estimated) : "N/A",
          gateNumber: flightData.departure.gate || "--",
          arrivalFullWords: flightData.arrival.airport || "N/A",
          arrivalIATA: flightData.arrival.iata || "N/A",
          arrivalTerminalNo: flightData.arrival.terminal || "N/A",
          arrivalTime: flightData.arrival.estimated ? formatTime(flightData.arrival.estimated) : "N/A",
          currentFlightStatus: flightData.flight_status || "N/A",
          baggage: flightData.arrival.baggage || "--",
          aircraftIATA: flightData.aircraft.iata || "Unknown",
          airlineName: flightData.airline.name || "Unknown",
          formattedDepartureDate: flightData.departure.estimated ? formatDate(flightData.departure.estimated) : "N/A",
          formattedArrivalDate: flightData.arrival.estimated ? formatDate(flightData.arrival.estimated) : "N/A",
        });
      } else {
        setFlightInfo(null); // Handle case where no data is returned
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      setFlightInfo(null); // Handle error by resetting flight info
    }
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
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>View Flight Info</Text>
      </TouchableOpacity>
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
        aircraftIATA={flightInfo?.aircraftIATA || ""}
        airlineName={flightInfo?.airlineName || ""}
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
});

export default App;
