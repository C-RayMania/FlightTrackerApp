import React, { useRef } from "react";
import {
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import WeatherBox from "./WeatherBox";

interface FlightInfoModalProps {
    visible: boolean;
    onClose: () => void;
    flightNumberFull: string;
    departureCityName: string;
    departureFullWords: string;
    departureIATA: string;
    departureTerminalNo: string;
    departureTime: string;
    gateNumber: string;
    arrivalCityName: string;
    arrivalFullWords: string;
    arrivalIATA: string;
    arrivalTerminalNo: string;
    arrivalTime: string;
    formattedDepartureDate: string;
    flightStatus: string;
    baggageClaim: string;
    aircraftIATA: string;
    airlineName: string;
    arrivalTemperature: string;
    arrivalPrecipitation: string;
    aircraftName: string;
    // depDelay: string;
    // arrDelay: string;
}

const FlightInfoModal: React.FC<FlightInfoModalProps> = ({ visible, onClose, arrivalPrecipitation, /*depDelay, arrDelay,*/ aircraftName, flightNumberFull, gateNumber, flightStatus, baggageClaim, aircraftIATA, airlineName, departureCityName, departureFullWords, departureIATA, departureTerminalNo, departureTime, arrivalCityName, arrivalFullWords, arrivalIATA, arrivalTerminalNo, arrivalTime, formattedDepartureDate, arrivalTemperature }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Slide-in animation
    const slideIn = () => {
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Slide-out animation
    const slideOut = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [500, 0], // Slide from 500px below screen to its final position
    });

    React.useEffect(() => {
        if (visible) {
            slideIn();
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { transform: [{ translateY }] },
                    ]}
                >
                    <View style={styles.infoHeading}>
                        <View>
                            <Text style={{ color: '#aaa', fontSize: 14 }}>{flightNumberFull} // {formattedDepartureDate}</Text>
                        </View>
                        <Text style={styles.title}>{departureCityName || "Origin"} <Text style={{ fontWeight: '300' }}>to</Text> {arrivalCityName || "Destination"}</Text>
                    </View>
                    <ScrollView>
                        <View style={styles.impInfo}>
                            <Text style={{ color: '#ddd', textTransform: 'capitalize', fontSize: 20, fontWeight: 500 }}>
                                {flightStatus}
                            </Text>
                            {flightStatus.toLowerCase() === 'landed' ? (
                                <Text style={{ color: '#ddd' }}>
                                    {`Baggage Claim: `}<FontAwesome6 name="suitcase-rolling" size={14} />{` ${baggageClaim || "--"}`}
                                </Text>
                            ) : (
                                <Text style={{ color: '#ddd' }}>
                                    {`Gate Number: `}<FontAwesome6 name="person-walking" size={14} />{` ${gateNumber || "--"}`}
                                </Text>
                            )}
                        </View>

                        <View style={styles.mainInfoArea}>
                            <View style={styles.flightInfoCard}>
                                <View>
                                    <Text style={styles.iataAirportCode}><FontAwesome6 name="plane-departure" size={24} /> {departureIATA || "ABC"}</Text>
                                    <Text style={styles.airportName}>{departureFullWords}</Text>
                                    <Text style={[styles.airportName, { fontWeight: '800', color: '#ddd' }]}>Terminal {departureTerminalNo || "--"}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <Text style={[{ color: '#000', marginHorizontal: 8, paddingHorizontal: 8, paddingBlock: 4, backgroundColor: '#ffc300', borderRadius: 8, fontSize: 16 }]}><FontAwesome6 name="person-walking-luggage" size={16} /> {gateNumber || "--"}</Text>
                                    <View>
                                        <Text style={styles.flightTimes}>{departureTime || "--:--"}</Text>
                                        {/* <Text>{depDelay}</Text> */}
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.flightInfoCard, { borderTopWidth: 2, borderTopColor: '#666' }]}>
                                <View>
                                    <Text style={styles.iataAirportCode}><FontAwesome6 name="plane-arrival" size={24} /> {arrivalIATA || "XYZ"}</Text>
                                    <Text style={styles.airportName}>{arrivalFullWords}</Text>
                                    <Text style={styles.airportName}>Terminal {arrivalTerminalNo || "--"}</Text>
                                </View>
                                <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                    <Text style={[{ color: '#000', marginHorizontal: 8, paddingHorizontal: 8, paddingBlock: 4, backgroundColor: '#ffc300', borderRadius: 8, fontSize: 16 }]}><FontAwesome6 name="suitcase" size={16} /> {baggageClaim || "--"}</Text>
                                    <View>
                                        <Text style={styles.flightTimes}>{arrivalTime || "--:--"}</Text>
                                        {/* <Text>{arrDelay}</Text> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.additionalInfo}>
                            <Text style={styles.additionalInfoText}>A/An <Text style={{ color: '#fff' }}><Link href={`https://www.google.com/search?q=${airlineName}`}>{airlineName}</Link></Text> flight</Text>
                            {/* <Text style={styles.additionalInfoText}>Your aircraft is a/an <Text style={{ color: '#fff' }}>{aircraftName} <Link href={`https://www.google.com/search?q=${aircraftIATA}+aircraft`}>{aircraftIATA}</Link></Text></Text> */}
                        </View>
                        <WeatherBox arrivalTemperature={arrivalTemperature || "--"} arrivalWeather={"--"} arrivalPrecipitation={arrivalPrecipitation || "None"} />
                        <View style={styles.warning}>
                            <Text style={[styles.warningText, { fontSize: 12 }]}><FontAwesome6 name="circle-info" /> Note</Text>
                            <Text style={styles.warningText}>While I strive to provide accurate information, this app is still a work in progress, and some details might not always be spot-on. I recommend cross-checking important data with trusted sources. Do inform me about the inaccuracies in the feedback form.</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={slideOut}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#333",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '92%'
    },
    impInfo: {
        paddingHorizontal: 20,
        paddingBlock: 12,
        borderBottomColor: '#444',
        borderBottomWidth: 2,
        backgroundColor: '#555'
    },
    infoHeading: {
        paddingHorizontal: 20,
        paddingTop: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#444'
    },
    mainInfoArea: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        marginBottom: 10,
        color: '#fff'
    },
    info: {
        fontSize: 18,
        marginBottom: 5,
        color: '#fff'
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#1e90ff",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 20,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    flightInfoCard: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingBlock: 12,
        maxWidth: '100%'
    },
    iataAirportCode: {
        color: '#fff',
        fontSize: 32,
    },
    airportName: {
        color: '#aaa',
        wordWrap: 'wrap',
        maxWidth: '69.765071868%'
    },
    flightTimes: {
        color: '#fff',
        fontSize: 32
    },
    additionalInfo: {
        paddingBlock: 16,
        paddingHorizontal: 20,
    },
    additionalInfoText: {
        color: '#aaa',
        fontSize: 16,
    },
    warning: {
        paddingHorizontal: 18,
        paddingBlock: 12,
        backgroundColor: '#222',
        borderBlockColor: "#8c2222",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    warningText: {
        color: '#aaa',
        fontSize: 10,
        fontWeight: 400
    },
});

export default FlightInfoModal;