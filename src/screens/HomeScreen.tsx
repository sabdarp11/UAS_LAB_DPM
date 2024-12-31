// Completely revamped HomeScreen with new UI design and styles
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Title, Paragraph, Text, Button } from "react-native-paper";
import { getAllBooks } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
}

const HomeScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      if (response && response.data) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Books")}
        style={styles.manageButton}
      >
        Manage Books
      </Button>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Explore Books</Text>
        {books.length === 0 ? (
          <Text style={styles.noBooks}>No books found</Text>
        ) : (
          books.map((book) => (
            <Card key={book._id} style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>{book.title}</Title>
                <Paragraph style={styles.author}>Author: {book.author}</Paragraph>
                <Paragraph style={styles.genre}>Genre: {book.genre}</Paragraph>
                <Paragraph numberOfLines={2} style={styles.description}>
                  {book.description}
                </Paragraph>
                <Button mode="text" onPress={() => {}} textColor="#87ceeb">
                  Read More
                </Button>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    padding: 16,
  },
  manageButton: {
    marginVertical: 10,
    backgroundColor: "#87ceeb", // Blue Sky color
    paddingVertical: 10,
    borderRadius: 5,
  },
  
  scrollView: {
    marginTop: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fafafa",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#2b2b2b",
    marginBottom: 15,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  title: {
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 10,
    fontWeight: "bold",
  },
  author: {
    fontSize: 16,
    color: "#bbbbbb",
    marginBottom: 5,
  },
  genre: {
    fontSize: 16,
    color: "#80cbc4",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 10,
  },
  noBooks: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
});

export default HomeScreen;
