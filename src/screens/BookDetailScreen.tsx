import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { getBookDetail } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface BookDetail {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  publishedYear: number;
  genre: string;
}

const BookDetailScreen = ({ route }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetail();
  }, []);

  const fetchBookDetail = async () => {
    try {
      const data = await getBookDetail(bookId);
      setBook(data);
    } catch (error) {
      console.error("Error fetching book detail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Buku tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>Oleh: {book.author}</Text>
        <Text style={styles.info}>Genre: {book.genre}</Text>
        <Text style={styles.info}>Tahun Terbit: {book.publishedYear}</Text>
        <Text style={styles.description}>{book.description}</Text>
        <TouchableOpacity style={styles.readButton}>
          <Text style={styles.readButtonText}>Read More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Background hitam untuk seluruh layar
  },
  coverImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginVertical: 20,
    alignSelf: "center",
    backgroundColor: "#333333", // Warna placeholder abu-abu gelap untuk gambar
  },
  contentContainer: {
    paddingHorizontal: 25,
    paddingBottom: 50,
  },
  title: {
    fontSize: 30,
    color: "#ffffff", // Warna putih untuk judul
    fontWeight: "bold",
    marginBottom: 12,
  },
  author: {
    fontSize: 20,
    color: "#d1d1d1", // Warna abu-abu terang untuk nama penulis
    marginBottom: 8,
  },
  info: {
    fontSize: 18,
    color: "#b0b0b0", // Warna abu-abu medium untuk informasi tambahan
    marginVertical: 4,
  },
  description: {
    fontSize: 18,
    color: "#e0e0e0", // Warna abu-abu terang untuk deskripsi
    lineHeight: 24,
    marginVertical: 22,
  },
  readButton: {
    backgroundColor: "#87ceeb", // Warna biru langit untuk tombol "Read More"
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  readButtonText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#87ceeb", // Warna biru langit untuk tombol "Delete"
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  deleteButtonText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
  },
  errorText: {
    color: "#ff4d4d", // Warna merah untuk pesan error
    fontSize: 20,
    textAlign: "center",
    marginTop: 30,
  },
});

export default BookDetailScreen;
