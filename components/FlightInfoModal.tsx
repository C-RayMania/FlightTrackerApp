import React, { useRef } from "react";
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

interface FlightInfoModalProps {
    visible: boolean;
    onClose: () => void;
    flightNumberFull: string;
    departureFullWords: string;
    departureIATA: string;
    departureTerminalNo: string;
    departureTime: string;
    gateNumber: string;
    arrivalFullWords: string;
    arrivalIATA: string;
    arrivalTerminalNo: string;
    arrivalTime: string;
    formattedDepartureDate: string;
    flightStatus: string;
    baggageClaim: string;
    aircraftIATA: string;
    airlineName: string;
}

const FlightInfoModal: React.FC<FlightInfoModalProps> = ({ visible, onClose, flightNumberFull, gateNumber, flightStatus, baggageClaim, aircraftIATA, airlineName, departureFullWords, departureIATA, departureTerminalNo, departureTime, arrivalFullWords, arrivalIATA, arrivalTerminalNo, arrivalTime, formattedDepartureDate }) => {
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
                        <Text style={styles.title}>{departureFullWords || "Origin"} <Text style={{ fontWeight: '300' }}>to</Text> {arrivalFullWords || "Destination"}</Text>
                    </View>
                    <View style={styles.impInfo}>
                        <Text style={{ color: '#ddd', textTransform: 'capitalize' }}>{flightStatus}</Text>
                        <Text style={{ color: '#ddd' }}>Baggage Claim: <FontAwesome6 name="suitcase-rolling" size={14} /> {baggageClaim || "--"}</Text>
                    </View>
                    <View style={styles.mainInfoArea}>
                        <View style={styles.flightInfoCard}>
                            <View>
                                <Text style={styles.iataAirportCode}><FontAwesome6 name="plane-departure" size={24} /> {departureIATA || "ABC"}</Text>
                                <Text style={styles.airportName}>{departureFullWords}</Text>
                                <Text style={styles.airportName}>Terminal {departureTerminalNo || "--"}</Text>
                            </View>
                            <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                <Text style={[{ color: '#000', marginHorizontal: 8, paddingHorizontal: 8, paddingBlock: 4, backgroundColor: '#ffc300', borderRadius: 8, fontSize: 16 }]}><FontAwesome6 name="archway" size={16} /> {gateNumber || "--"}</Text>
                                <Text style={styles.flightTimes}>{departureTime || "00:00"}</Text>
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
                                <Text style={styles.flightTimes}>{arrivalTime || "01:10"}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.additionalInfo}>
                        <Text style={styles.additionalInfoText}>An <Text style={{ color: '#fff' }}>{airlineName}</Text> flight</Text>
                        <Text style={styles.additionalInfoText}>Your flight is a/an <Text style={{ color: '#fff' }}>[airplane_manufacturer] {aircraftIATA}</Text></Text>
                    </View>
                    <View style={styles.warning}>
                        <Text style={[styles.warningText, { fontSize: 12 }]}><FontAwesome6 name="circle-info" /> Note</Text>
                        <Text style={styles.warningText}>While we strive to provide accurate information, this app is still a work in progress, and some details might not always be spot-on. We recommend cross-checking important data with trusted sources. Do let us know about the inaccuracies in the feedback form.</Text>
                    </View>
                    <TouchableOpacity style={styles.closeButton} onPress={slideOut}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
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
        overflow: 'scroll'
    },
    iataAirportCode: {
        color: '#fff',
        fontSize: 32,
    },
    airportName: {
        color: '#aaa',
        wordWrap: 'wrap',
        maxWidth: '99%'
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
    }
});

export default FlightInfoModal;