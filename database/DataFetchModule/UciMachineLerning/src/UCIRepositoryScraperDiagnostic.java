import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.FileWriter;
import java.io.IOException;

public class UCIRepositoryScraperDiagnostic {

    private static final String BASE_URL = "https://archive.ics.uci.edu/dataset/53/iris";
    private static final String OUTPUT_FILE = "output.txt";

    public static void main(String[] args) {
        try {
            Document doc = Jsoup.connect(BASE_URL).get();
            String htmlContent = doc.html();

            // Save HTML content to a file
            try (FileWriter writer = new FileWriter(OUTPUT_FILE)) {
                writer.write(htmlContent);
            }

            System.out.println("HTML content saved to " + OUTPUT_FILE);
        } catch (IOException e) {
            System.err.println("Error connecting to the website: " + e.getMessage());
        }
    }
}
