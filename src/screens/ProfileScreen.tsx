// React Native ProfileScreen with profile box similar to email box
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserProfile } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface UserProfile {
  username: string;
  email: string;
  name: string;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserProfile();
      setProfile(userData);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon
          size={120}
          icon="account-circle"
          style={styles.avatar}
          color="#f0f0f0"
        />
        <Title style={styles.name}>{profile?.name || "Anonymous"}</Title>
        <Paragraph style={styles.username}>@{profile?.username || "username"}</Paragraph>
      </View>

      <Card style={styles.cardContainer}>
        <Card.Content>
          <View style={styles.infoSection}>
            <IconButton icon="email-outline" size={26} />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{profile?.email || "No email provided"}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.cardActions}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Books" as never)}
            style={styles.actionButton}
            icon="book"
          >
            Books Library
          </Button>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
            textColor="#ff5252"
          >
            Log Out
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#101010",
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#202020",
    borderBottomWidth: 2,
    borderBottomColor: "#444",
  },
  avatar: {
    backgroundColor: "#303030",
    padding: 10,
    borderRadius: 60,
  },
  name: {
    color: "#f0f0f0",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },
  username: {
    color: "#bbbbbb",
    fontSize: 16,
  },
  cardContainer: {
    backgroundColor: "#282828",
    marginVertical: 20,
    padding: 15,
    borderRadius: 8, // Changed the radius to make the box less round
    borderColor: "#555",
    borderWidth: 1,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    color: "#aaaaaa",
    fontSize: 14,
  },
  value: {
    color: "#f0f0f0",
    fontSize: 18,
    fontWeight: "500",
  },
  cardActions: {
    backgroundColor: "#282828",
    marginVertical: 20,
    padding: 15,
    borderRadius: 8, // Same change for action buttons container
    borderColor: "#555",
    borderWidth: 1,
  },
  actionButton: {
    backgroundColor: "#505050",
    marginBottom: 15,
  },
  logoutButton: {
    borderColor: "#ff5252",
    borderWidth: 2,
  },
});

export default ProfileScreen;
