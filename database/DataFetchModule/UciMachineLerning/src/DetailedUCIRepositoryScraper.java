import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

public class DetailedUCIRepositoryScraper {
    private static final String BASE_URL = "https://archive.ics.uci.edu/dataset/53/iris"; // Update to your actual URL

    public static void main(String[] args) {
        try {
            // Connect and get the HTML document
            Document doc = Jsoup.connect(BASE_URL).get();
            Map<String, String> datasetInfo = new LinkedHashMap<>();

            // Extract basic information
            datasetInfo.put("Name", doc.select("div.text-xl.font-semibold.text-primary").text());
            datasetInfo.put("Donated on", doc.select("h2.text-sm").text().replace("Donated on ", ""));
            datasetInfo.put("Abstract", doc.select("div.whitespace-pre-wrap").text());

            // Extract additional information like variables, dataset characteristics, etc.
            extractAdditionalInfo(doc, datasetInfo);

            // Extract dataset citations, views (numbers only)
            datasetInfo.put("Citations", extractNumber(doc, "div:contains(citations)"));
            datasetInfo.put("Views", extractNumber(doc, "div:contains(views)"));

            // Extract Variables Table
            Element variablesTable = doc.select("table:contains(Variable Name)").first();
            if (variablesTable != null) {
                StringBuilder variablesInfo = new StringBuilder();
                Elements rows = variablesTable.select("tr");
                for (Element row : rows) {
                    Elements cols = row.select("td, th");
                    variablesInfo.append(cols.stream().map(Element::text).reduce((a, b) -> a + "\t" + b).orElse("")).append("\n");
                }
                datasetInfo.put("Variables Table", variablesInfo.toString());
            }

            // Extract Dataset Files (with pagination support)
            Elements fileRows = doc.select("div:contains(Dataset Files) tr");
            if (fileRows != null) {
                StringBuilder filesInfo = new StringBuilder();
                for (Element row : fileRows) {
                    Elements cols = row.select("td");
                    if (cols.size() > 1) {
                        filesInfo.append(cols.get(0).text()).append(" (").append(cols.get(1).text()).append(")\n");
                    }
                }
                datasetInfo.put("Dataset Files", filesInfo.toString());
            }

            // Print the extracted data
            for (Map.Entry<String, String> entry : datasetInfo.entrySet()) {
                System.out.println(entry.getKey() + " : " + entry.getValue());
            }

        } catch (IOException e) {
            System.err.println("Error connecting to the website: " + e.getMessage());
        }
    }

    // Function to extract the numbers from views, citations, etc.
    private static String extractNumber(Document doc, String selector) {
        Element element = doc.select(selector).first();
        if (element != null) {
            String text = element.text();
            return text.replaceAll("[^0-9]", ""); // Keep only numeric characters
        }
        return "N/A";
    }

    // Function to extract Additional Information and other hidden sections
    private static void extractAdditionalInfo(Document doc, Map<String, String> datasetInfo) {
        // Select the "Additional Information" div or any other info
        Element additionalInfo = doc.select("div:contains(Additional Information)").first();
        if (additionalInfo != null) {
            datasetInfo.put("Additional Information", additionalInfo.text());
        }

        // Extract Dataset Information if available
        Element datasetInfoSection = doc.select("div:contains(Dataset Information)").first();
        if (datasetInfoSection != null) {
            datasetInfo.put("Dataset Information", datasetInfoSection.text());
        }
    }
}
