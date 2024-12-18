package ReposScraper;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


public class RepoScrapByDataSet {

    public static final String BASE_URL = "https://archive.ics.uci.edu/dataset/";


    public void scrapMetadata(WebDriver driver, WebDriverWait wait ,int datasetNumber) {

        driver.get("https://archive.ics.uci.edu/dataset/" + datasetNumber);
        System.out.println(datasetNumber);
        try{
            Thread.sleep(2000);
        }catch(Exception e){}
        ArrayList<ArrayList<String>> filelist = new ArrayList<>();
        ArrayList<ArrayList<String>> variablelist = new ArrayList<>();

        filelist = scrapDatasetFiles(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[7]/div[2]");
        variablelist = scrapVariablesTable(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[4]/div[2]/div/div/div[1]");


        DatasetMetadataFormate metadata = new DatasetMetadataFormate(
                getTextOrEmpty(driver, "h1.text-3xl"),
                getTextOrEmpty(driver, "h2.text-sm").replace("Donated on ", ""),
                getTextOrEmpty(driver, "p[style*=clamp]"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[1]/p"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[2]/p"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[3]/p"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[4]/p"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[5]/p"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[6]/p"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[2]/div[2]/div/div[1]/div/p"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[2]/div[2]/div/div[2]/div/p"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[3]/div[2]/div/div"),
                variablelist,
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[5]/div[2]/div/div/div/div/p"),
                getCreatorsArray(driver),
                getDOIWithLink(driver),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[2]/div[11]/div"),
                filelist,
                getKeywordsArray(driver),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[2]/div[1]/div[2]/div[1]/span"),
                getTextOrEmpty(driver, "/html/body/div/div[1]/div[1]/main/div/div[2]/div[1]/div[2]/div[2]/span")
        );


        //System.out.println(datasetNumber + " : " + DatasetCSVWriter.appendToCSV(metadata ,datasetNumber));

        printFormattedMetadata(metadata);


    }



    private static String getTextOrEmpty(WebDriver driver, String selector) {
        try {
            if (selector.startsWith("/")) {
                return driver.findElement(By.xpath(selector)).getText();
            } else {
                return driver.findElement(By.cssSelector(selector)).getText();
            }
        } catch (Exception e) {
            return "";
        }
    }



    private static String getDOIWithLink(WebDriver driver) {
        try {
            WebElement doiElement = driver.findElement(
                    By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[9]/div[2]/a")
            );
            return doiElement.getText() + " Link: " + doiElement.getAttribute("href");
        } catch (Exception e) {
            return "";
        }
    }

    // Helper method to get creators array
    private static String[] getCreatorsArray(WebDriver driver) {
        try {
            String creatorsText = driver.findElement(
                    By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[7]/div/div[2]")
            ).getText();
            return creatorsText.split(",\\s*");
        } catch (Exception e) {
            return new String[0];
        }
    }

    // Helper method to get keywords array
    private static String[] getKeywordsArray(WebDriver driver) {
        try {
            String keywordsText = driver.findElement(
                    By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[5]/div[2]/a")
            ).getText();
            return keywordsText.split(",\\s*");
        } catch (Exception e) {
            return new String[0];
        }
    }


    private static ArrayList<ArrayList<String>> scrapVariablesTable(WebDriver driver, String path) {
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        try {
            //Thread.sleep(2000);
            Set<String> processedRows = new HashSet<>();  // To track unique rows
            boolean firstPage = true;  // Flag to check if it's the first page

            // Loop to go through all pages
            while (true) {
                WebElement table = driver.findElement(By.xpath(path));

                // Extract header only once
                if (firstPage) {
                    List<WebElement> headers = table.findElements(By.xpath(".//thead/tr/th"));
                    ArrayList<String> headerRow = new ArrayList<>();
                    for (WebElement header : headers) {
                        headerRow.add(header.getText());
                    }
                    result.add(headerRow);
                    firstPage = false;
                }

                // Extract rows
                List<WebElement> rows = table.findElements(By.xpath(".//tbody/tr"));
                for (WebElement row : rows) {
                    List<WebElement> cells = row.findElements(By.tagName("td"));
                    if (!cells.isEmpty()) {
                        // Create a unique key for this row using the first column (Variable Name)
                        String rowKey = cells.get(0).getText();
                        // Only process this row if we haven't seen it before
                        if (!processedRows.contains(rowKey)) {
                            processedRows.add(rowKey);
                            ArrayList<String> dataRow = new ArrayList<>();
                            for (WebElement cell : cells) {
                                dataRow.add(cell.getText());
                            }
                            result.add(dataRow);
                        }
                    }
                }

                // Try to find the "Next" button
                try {
                    WebElement nextButton = driver.findElement(By.xpath("//button[@aria-label='Next Page']"));
                    if (nextButton.getAttribute("disabled") != null) {
                        break;  // Stop if the button is disabled
                    } else {
                        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", nextButton);
                        //Thread.sleep(2000); // Add a short wait for the next page to load
                    }
                } catch (Exception e) {
                    // Break the loop if the "Next" button is not found
                    break;
                }
            }
        } catch (Exception e) {
            //e.printStackTrace();
        }
        return result;
    }


    private static ArrayList<ArrayList<String>> scrapDatasetFiles(WebDriver driver, String path) {
        ArrayList<ArrayList<String>> result = new ArrayList<>();
        try {
            Set<String> processedRows = new HashSet<>();  // To track unique rows
            boolean firstPage = true;  // Flag to check if it's the first page

            // Loop to go through all pages
            while (true) {
                WebElement table = driver.findElement(By.xpath(path));

                // Extract header only once
                if (firstPage) {
                    List<WebElement> headers = table.findElements(By.xpath(".//thead/tr/th"));
                    ArrayList<String> headerRow = new ArrayList<>();
                    for (WebElement header : headers) {
                        headerRow.add(header.getText());
                    }
                    result.add(headerRow);
                    firstPage = false;
                }

                // Extract rows
                List<WebElement> rows = table.findElements(By.xpath(".//tbody/tr"));
                for (WebElement row : rows) {
                    List<WebElement> cells = row.findElements(By.tagName("td"));
                    if (!cells.isEmpty()) {
                        // Create a unique key for this row using the first column (Variable Name)
                        String rowKey = cells.get(0).getText();
                        // Only process this row if we haven't seen it before
                        if (!processedRows.contains(rowKey)) {
                            processedRows.add(rowKey);
                            ArrayList<String> dataRow = new ArrayList<>();
                            for (WebElement cell : cells) {
                                dataRow.add(cell.getText());
                            }
                            result.add(dataRow);
                        }
                    }
                }

                // Try to find the "Next" button
                try {
                    WebElement nextButton = driver.findElement(
                            By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[7]/div[2]/div/div/div[2]/div/button[2]")
                    );
                    if (nextButton.getAttribute("disabled") != null) {
                        break;  // Stop if the button is disabled
                    } else {
                        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", nextButton);
                        //Thread.sleep(2000); // Add a short wait for the next page to load
                    }
                } catch (Exception e) {
                    // Break the loop if the "Next" button is not found
                    break;
                }
            }
        } catch (Exception e) {
            //e.printStackTrace();
        }
        return result;
    }






























    private static void printFormattedMetadata(DatasetMetadataFormate metadata) {
        System.out.println("\n=== Dataset Metadata ===");
        System.out.println("Name: " + metadata.name);
        System.out.println("Donated Date: " + metadata.donatedDate);
        System.out.println("Abstract: " + metadata.abstractInfo);
        System.out.println("Dataset Characteristics: " + metadata.datasetCharacteristics);
        System.out.println("Subject Area: " + metadata.subjectArea);
        System.out.println("Associated Tasks: " + metadata.associatedTasks);
        System.out.println("Feature Type: " + metadata.featureType);
        System.out.println("Instances: " + metadata.instances);
        System.out.println("Features: " + metadata.features);
        System.out.println("Dataset Information: " + metadata.datasetInformation);
        System.out.println("Has Missing Values?: " + metadata.hasMissingValues);
        System.out.println("Introductory Papers: " + metadata.introductoryPapers);
        System.out.println("Additional Variable Info: " + metadata.additionalVariableInfo);

        System.out.println("\nCreators:");
        for (String creator : metadata.creators) {
            System.out.println("- " + creator.trim());
        }

        System.out.println("\nDOI: " + metadata.doi);
        System.out.println("License: " + metadata.license);

        System.out.println("\nKeywords:");
        for (String keyword : metadata.keywords) {
            System.out.println("- " + keyword.trim());
        }

        System.out.println("\nCitations: " + metadata.citations);
        System.out.println("Views: " + metadata.views);

        System.out.println("\nVariables Table:");
        printTable(metadata.variablesTable);

        System.out.println("\nDataset Files:");
        printTable(metadata.Datasetfiles);
    }

    // Helper method to print table data
    private static void printTable(ArrayList<ArrayList<String>> table) {
        if (table == null || table.isEmpty()) {
            System.out.println("No data available");
            return;
        }

        for (ArrayList<String> row : table) {
            System.out.println(String.join(" | ", row));
        }
    }


























}
