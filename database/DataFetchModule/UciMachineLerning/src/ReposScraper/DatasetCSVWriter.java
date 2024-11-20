package ReposScraper;

import java.io.*;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DatasetCSVWriter {
    private static final String CSV_FILE = "dataset_metadata.csv";
    private static final String SEPARATOR = ",";
    private static final String ARRAY_SEPARATOR = ";";

    /**
     * Appends a DatasetMetadataFormate object to the CSV file
     * @param metadata The metadata object to append
     * @param uciRepoId The UCI repository ID
     * @return true if successfully written, false otherwise
     */
    public static boolean appendToCSV(DatasetMetadataFormate metadata, int uciRepoId) {
        try {
            File file = new File(CSV_FILE);
            boolean isNewFile = !file.exists();

            FileWriter fw = new FileWriter(file, true);
            BufferedWriter bw = new BufferedWriter(fw);
            PrintWriter out = new PrintWriter(bw);

            // Write headers if it's a new file
            if (isNewFile) {
                writeHeaders(out);
            }

            // Convert the object to CSV format and write
            String csvLine = convertToCSVLine(metadata, uciRepoId);
            out.println(csvLine);

            out.flush();
            out.close();
            return true;

        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Writes the CSV headers
     */
    private static void writeHeaders(PrintWriter out) {
        String[] headers = {
                "UCIrepoId", "Timestamp",
                "Name", "DonatedDate", "AbstractInfo", "DatasetCharacteristics",
                "SubjectArea", "AssociatedTasks", "FeatureType", "Instances",
                "Features", "DatasetInformation", "HasMissingValues",
                "IntroductoryPapers", "VariablesTable", "AdditionalVariableInfo",
                "Creators", "DOI", "License", "DatasetFiles", "Keywords",
                "Citations", "Views"
        };
        out.println(String.join(SEPARATOR, headers));
    }

    /**
     * Converts a DatasetMetadataFormate object to a CSV line
     */
    private static String convertToCSVLine(DatasetMetadataFormate metadata, int uciRepoId) {
        ArrayList<String> values = new ArrayList<>();

        // Add UCI repo ID and current timestamp
        values.add(String.valueOf(uciRepoId));
        values.add(getCurrentTimestamp());

        // Add simple string fields
        values.add(escapeField(metadata.name));
        values.add(escapeField(metadata.donatedDate));
        values.add(escapeField(metadata.abstractInfo));
        values.add(escapeField(metadata.datasetCharacteristics));
        values.add(escapeField(metadata.subjectArea));
        values.add(escapeField(metadata.associatedTasks));
        values.add(escapeField(metadata.featureType));
        values.add(escapeField(metadata.instances));
        values.add(escapeField(metadata.features));
        values.add(escapeField(metadata.datasetInformation));
        values.add(escapeField(metadata.hasMissingValues));
        values.add(escapeField(metadata.introductoryPapers));

        // Handle variablesTable (ArrayList<ArrayList<String>>)
        values.add(escapeField(convertNestedArrayList(metadata.variablesTable)));

        values.add(escapeField(metadata.additionalVariableInfo));

        // Handle creators array
        values.add(escapeField(String.join(ARRAY_SEPARATOR, metadata.creators)));

        values.add(escapeField(metadata.doi));
        values.add(escapeField(metadata.license));

        // Handle Datasetfiles (ArrayList<ArrayList<String>>)
        values.add(escapeField(convertNestedArrayList(metadata.Datasetfiles)));

        // Handle keywords array
        values.add(escapeField(String.join(ARRAY_SEPARATOR, metadata.keywords)));

        values.add(escapeField(metadata.citations));
        values.add(escapeField(metadata.views));

        return String.join(SEPARATOR, values);
    }

    /**
     * Gets current timestamp in a formatted string
     */
    private static String getCurrentTimestamp() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return now.format(formatter);
    }

    /**
     * Converts a nested ArrayList to a string representation
     */
    private static String convertNestedArrayList(ArrayList<ArrayList<String>> nestedList) {
        if (nestedList == null) return "";
        return nestedList.stream()
                .map(innerList -> String.join(ARRAY_SEPARATOR, innerList))
                .collect(Collectors.joining("|"));
    }

    /**
     * Escapes special characters in a field
     */
    private static String escapeField(String field) {
        if (field == null) return "";
        // Escape quotes and wrap in quotes if contains special characters
        String escaped = field.replace("\"", "\"\"");
        if (escaped.contains(SEPARATOR) || escaped.contains("\"") || escaped.contains("\n")) {
            escaped = "\"" + escaped + "\"";
        }
        return escaped;
    }
}