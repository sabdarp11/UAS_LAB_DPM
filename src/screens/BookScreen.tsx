import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal, SafeAreaView, ScrollView, FlatList } from "react-native";
import { TextInput, Button as PaperButton, Card, Title, Paragraph, IconButton, Surface } from "react-native-paper";
import { getAllBooks, createBook, updateBook, deleteBook } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
}

const BookScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      if (response && response.data) {
        setBooks(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching books:", error);
      Alert.alert("Error", error.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = () => {
    setSelectedBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      genre: "",
    });
    setDialogVisible(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      genre: book.genre || "",
    });
    setDialogVisible(true);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Validation Error", "Title is required");
      return false;
    }
    if (formData.title.trim().length < 3) {
      Alert.alert("Validation Error", "Title must be at least 3 characters");
      return false;
    }

    if (!formData.author.trim()) {
      Alert.alert("Validation Error", "Author is required");
      return false;
    }
    if (formData.author.trim().length < 3) {
      Alert.alert("Validation Error", "Author must be at least 3 characters");
      return false;
    }

    if (!formData.description.trim()) {
      Alert.alert("Validation Error", "Description is required");
      return false;
    }
    if (formData.description.trim().length < 10) {
      Alert.alert(
        "Validation Error",
        "Description must be at least 10 characters"
      );
      return false;
    }

    if (!formData.genre.trim()) {
      Alert.alert("Validation Error", "Genre is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
      genre: formData.genre.trim(),
    };

    if (selectedBook) {
      try {
        const response = await updateBook(selectedBook._id, bookData);
        if (response && response.data) {
          setDialogVisible(false);
          await fetchBooks();
          Alert.alert("Success", "Book updated successfully");
        } else {
          throw new Error("Failed to update book");
        }
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to update book");
      }
    } else {
      try {
        const response = await createBook(bookData);
        if (response && response.data) {
          setDialogVisible(false);
          await fetchBooks();
          Alert.alert("Success", "Book created successfully");
        } else {
          throw new Error("Failed to create book");
        }
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to create book");
      }
    }
  };

  const handleDelete = (bookId: string) => {
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBook(bookId);
            Alert.alert("Success", "Book deleted successfully");
            fetchBooks();
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete book");
          }
        },
      },
    ]);
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Title>{item.title}</Title>
        <Paragraph>Author: {item.author}</Paragraph>
        <Paragraph>Genre: {item.genre}</Paragraph>
        <Paragraph>Description: {item.description}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <PaperButton onPress={() => handleEditBook(item)} style={styles.textButton}>Edit</PaperButton>
        <PaperButton onPress={() => handleDelete(item._id)} style={styles.textButton}>Delete</PaperButton>
      </Card.Actions>
    </Card>
  );

  const renderForm = () => (
    <Modal
      visible={dialogVisible}
      animationType="slide"
      onRequestClose={() => setDialogVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Surface style={styles.modalHeader}>
          <Title>{selectedBook ? "Edit Book" : "Add New Book"}</Title>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setDialogVisible(false)}
          />
        </Surface>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.formContainer}
        >
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              label="Title *"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Author *"
              value={formData.author}
              onChangeText={(text) =>
                setFormData({ ...formData, author: text })
              }
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={4}
              style={[styles.input, styles.multilineInput]}
              mode="outlined"
            />
            <TextInput
              label="Genre *"
              value={formData.genre}
              onChangeText={(text) => setFormData({ ...formData, genre: text })}
              style={styles.input}
              mode="outlined"
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PaperButton
              mode="outlined"
              onPress={() => setDialogVisible(false)}
              style={styles.buttonCancel}
            >
              Cancel
            </PaperButton>
            <PaperButton
              mode="contained"
              onPress={handleSubmit}
              style={styles.buttonSave}
            >
              Save
            </PaperButton>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <PaperButton
        mode="contained"
        onPress={handleAddBook}
        style={styles.addButton}
        icon="plus"
      >
        Add New Book
      </PaperButton>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />

      {renderForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E6F4FF", // Light Bluesky color
    elevation: 5,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    paddingVertical: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  multilineInput: {
    maxHeight: 150,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  buttonCancel: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#B3D9FF", // Light Bluesky color for cancel
    borderRadius: 8,
  },
  buttonSave: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#4A90E2", // Darker Bluesky for Save
    borderRadius: 8,
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: "#4A90E2", // Bluesky for Add Button
    borderRadius: 8,
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardActions: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textButton: {
    color: "#4A90E2", // Bluesky color for text buttons
  },
});

export default BookScreen;
