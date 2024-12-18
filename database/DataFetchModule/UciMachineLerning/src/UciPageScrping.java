import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.awt.*;
import java.time.Duration;
import java.util.*;
import java.util.List;


public class UciPageScrping {

    private static final String BASE_URL = "https://archive.ics.uci.edu/dataset/";
    private static WebDriver driver;
    private static JavascriptExecutor js;
    private static WebDriverWait wait;



    public static void main(String[] args) {

    setupWebDriver();

    int[] repo = {1,2,3,56};

    for (int i = 0; i < repo.length; i++) {
        System.out.println();
        System.out.println("Dataset " + (i+1) + ": " + BASE_URL + String.valueOf(repo[i]));
        pageReport(driver, String.valueOf(repo[i]));
    }


    driver.quit();

    }


    static int pageReport(WebDriver driver , String name ) {

        driver.get(BASE_URL + name);
        // Wait for the page to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("h1.text-3xl")));

        // Extract basic information



        //printeverything(driver);
        scrapVariablesTable(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[3]/div[2]");
        scrapDatasetFiles(driver, "/html/body/div/div[1]/div[1]/main/div/div[1]/div[7]/div[2]");

        // Close the browser

        return 0;
    }

    static void scrapDatasetFiles(WebDriver driver, String path) {

        try {
            System.out.println("Dataset Files: ");
            Set<String> processedRows = new HashSet<>();  // To track unique rows
            boolean firstPage = true;  // Flag to check if it's the first page
            // Loop to go through all pages
            while (true) {
                WebElement table = driver.findElement(By.xpath(path));
                // Extract header only once
                if (firstPage) {
                    List<WebElement> headers = table.findElements(By.xpath(".//thead/tr/th"));
                    for (WebElement header : headers) {
                        System.out.print(header.getText() + " | ");
                    }
                    System.out.println();
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

                            for (WebElement cell : cells) {
                                System.out.print(cell.getText() + " | ");
                            }
                            System.out.println();
                        }
                    }
                }
                // Check if the "Next" button is enabled
                // Try to find the "Next" button
                try {
                    WebElement nextButton = driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[7]/div[2]/div/div/div[2]/div/button[2]"));
                    if (nextButton.getAttribute("disabled") != null) {
                        break; // Stop if the button is disabled
                    } else {
                        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", nextButton);
                        //Thread.sleep(2000); // Add a short wait for the next page to load
                    }
                } catch (NoSuchElementException e) {
                    // Break the loop if the "Next" button is not found
                    break;
                }
            }
        } catch (Exception e) {
            //e.printStackTrace();
        }
    }
    static void scrapVariablesTable(WebDriver driver, String path) {
        try {
            System.out.println("Dataset Variables: ");
            Set<String> processedRows = new HashSet<>();  // To track unique rows
            boolean firstPage = true;  // Flag to check if it's the first page
            // Loop to go through all pages
            while (true) {
                WebElement table = driver.findElement(By.xpath(path));
                // Extract header only once
                if (firstPage) {
                    List<WebElement> headers = table.findElements(By.xpath(".//thead/tr/th"));
                    for (WebElement header : headers) {
                        System.out.print(header.getText() + " | ");
                    }
                    System.out.println();
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

                            for (WebElement cell : cells) {
                                System.out.print(cell.getText() + " | ");
                            }
                            System.out.println();
                        }
                    }
                }
                // Check if the "Next" button is enabled
                WebElement nextButton = driver.findElement(By.xpath("//button[@aria-label='Next Page']"));
                if (nextButton.getAttribute("disabled") != null) {
                    break; // Stop if the button is disabled
                } else {
                    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", nextButton);
                    //Thread.sleep(2000); // Add a short wait for the next page to load
                }
            }
        } catch (Exception e) {
            //e.printStackTrace();
        }
    }

    static void printeverything(WebDriver driver) {
        try {
            try {
                System.out.println("Name: " + driver.findElement(By.cssSelector("h1.text-3xl")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Donated on: " + driver.findElement(By.cssSelector("h2.text-sm")).getText().replace("Donated on ", ""));
            } catch (Exception e) {}

            try {
                System.out.println("Abstract: " + driver.findElement(By.cssSelector("p[style*=clamp]")).getText());
            } catch (Exception e) {}


            try {
                System.out.println("Dataset Characteristics: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[1]/p")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Subject Area: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[2]/p")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Associated Tasks: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[3]/p")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Feature Type: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[4]/p")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Instances: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[5]/p")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Features: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[6]/p")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Dataset Information: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[2]/div[2]/div/div[1]/div/p")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Has Missing Values?: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[2]/div[2]/div/div[2]/div/p")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Introductory Paper: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[3]/div[2]/div/div")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Additional Variable Information: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[5]/div[2]/div/div/div/div/p")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("citations: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[1]/div[2]/div[1]/span")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("views: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[1]/div[2]/div[2]/span")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Keywords: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[5]/div[2]/a")).getText());
            } catch (Exception e) {}

            try {
                System.out.println("Creators: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[7]/div/div[2]")).getText());
            } catch (Exception e) {}

            try {
                WebElement doiElement = driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[9]/div[2]/a"));
                System.out.println("DOI: " + doiElement.getText() + " Link: " + doiElement.getAttribute("href"));
            } catch (Exception e) {}

            try {
                System.out.println("License: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[11]/div")).getText());
            } catch (Exception e) {}

            try {

                System.out.println("Reviews: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[9]/div[2]/div[1]/div/h1")).getText() + " By: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[8]/div[2]/div[1]/div/section/span")).getText() );
            } catch (Exception e) {}

        } catch (Exception e) {}
    }




  /*  static void printeverything(WebDriver driver) {
        System.out.println("Name: " + driver.findElement(By.cssSelector("h1.text-3xl")).getText());
        System.out.println("Donated on: " + driver.findElement(By.cssSelector("h2.text-sm")).getText().replace("Donated on ", ""));
        System.out.println("Abstract: " + driver.findElement(By.cssSelector("p[style*=clamp]")).getText());
        System.out.println("Databases: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[1]/div/p/span")).getText());
        System.out.println("Dataset Characteristics: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[1]/p")).getText());
        System.out.println("Subject Area: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[2]/p")).getText());
        System.out.println("Associated Tasks: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[3]/p")).getText());
        System.out.println("Feature Type: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[4]/p")).getText());
        System.out.println("Instances: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[5]/p")).getText());
        System.out.println("Features: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[1]/div[2]/div[2]/div[6]/p")).getText());
        // need to work on the dataset information to make the redable
        System.out.println("Dataset Information: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[2]/div[2]/div/div[1]/div/p")).getText());
        System.out.println("Has Missing Values?: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[2]/div[2]/div/div[2]/div/p")).getText());
        System.out.println("Introductory Paper: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[3]/div[2]/div/div")).getText());
        //needto make the function to get the data from the table
        //System.out.println("Variables Table: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[4]/div[2]/div/div/div[1]")).getText());
        //need to make the function to get the data from the table
       // System.out.println("Dataset Files: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[7]/div[2]/div/div/div[1]")).getText());
        System.out.println("Additional Variable Information: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[11]/div")).getText());
        //System.out.println("Reviews: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[9]/div[2]/div[1]/div/h1")).getText() + " By: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[1]/div[9]/div[2]/div[1]/div")).getText() );
        System.out.println("citations: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[1]/div[2]/div[1]/span")).getText());
        System.out.println("views: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[1]/div[2]/div[2]/span")).getText());
        System.out.println("Keywords: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[5]/div[2]/a")).getText());
        System.out.println("Creators: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[7]/div/div[2]")).getText());
        System.out.println("DOI: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[9]/div[2]/a")).getText() + " Link: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[9]/div[2]/a")).getAttribute("href"));
        System.out.println("License: " + driver.findElement(By.xpath("/html/body/div/div[1]/div[1]/main/div/div[2]/div[11]/div")).getText());
        //System.out.println("Dataset: " + driver.findElement(By.xpath("hello")).getText());

    }*/

    private static void setupWebDriver() {
        System.setProperty("webdriver.chrome.driver", "E:\\Uwindsor\\SEM~2\\ADT\\project\\AdtMlDataScrap\\Driver files\\chromedriver-win64\\chromedriver.exe");
        ChromeOptions options = new ChromeOptions();
        //options.addArguments("--headless");
        driver = new ChromeDriver(options);
        //js = (JavascriptExecutor) driver;
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

}
