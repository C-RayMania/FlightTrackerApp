import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    arrivalTemperature: string;
    arrivalWeather: string;
    arrivalPrecipitation: string;
};

export default function WeatherBox({ arrivalTemperature, arrivalPrecipitation, arrivalWeather }: Props) {
    return (
        <View style={styles.weatherInfo}>
            <Text style={{ color: '#fff', fontSize: 20 }}>Destination Weather Details</Text>
            <View style={styles.weatherBox}>
                <View style={[styles.weatherData]}>
                    <Text style={styles.weatherBoxText}>Weather</Text>
                    <Text style={styles.weatherBoxText}>{arrivalWeather}</Text>
                </View>
                <View style={styles.weatherData}>
                    <Text style={styles.weatherBoxText}>Temperature</Text>
                    <Text style={styles.weatherBoxText}>{arrivalTemperature}</Text>
                </View>
                <View style={[styles.weatherData, { borderBottomWidth: 0 }]}>
                    <Text style={styles.weatherBoxText}>Precipitation</Text>
                    <Text style={styles.weatherBoxText}>{arrivalPrecipitation}</Text>
                </View>
            </View>
            <Text style={{ textAlign: 'center', color: '#fff', marginTop: 8 }}><Link href="https://www.accuweather.com/">AccuWeather</Link></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    weatherInfo: {
        paddingBlock: 16,
        paddingHorizontal: 20,
    },
    weatherBox: {
        paddingBlock: 6,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderColor: '#555',
        borderRadius: 16,
        maxWidth: '100%',
        marginTop: 12,
        backgroundColor: '#444'
    },
    weatherData: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBlock: 12,
        borderBlockColor: '#555',
        borderBottomWidth: 2,
    },
    weatherBoxText: {
        color: '#fff',
        fontSize: 22,
    }
});