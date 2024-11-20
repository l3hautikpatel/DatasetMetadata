import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class DetailedUCIRepositoryScraperSelenium {
    private static final String BASE_URL = "https://archive.ics.uci.edu/dataset/45/heart+disease";
    private static WebDriver driver;
    private static JavascriptExecutor js;
    private static WebDriverWait wait;

    public static void main(String[] args) {
        try {
            setupWebDriver();
            Map<String, String> datasetInfo = new LinkedHashMap<>();

            driver.get(BASE_URL);
            wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("h1.text-3xl")));

            extractBasicInfo(datasetInfo);
            extractCharacteristics(datasetInfo);
            extractCreatorsAndDOI(datasetInfo);
            extractLicense(datasetInfo);
            extractDatasetInfo(datasetInfo);
            extractVariablesTable(datasetInfo);
            extractAdditionalVarInfo(datasetInfo);
            extractDatasetFiles(datasetInfo);
            extractCitationsViewsReviews(datasetInfo);

            // Print all extracted information
            datasetInfo.forEach((key, value) -> System.out.println(key + " : " + value));

        } finally {
            if (driver != null) {
                driver.quit();
            }
        }
    }

    private static void setupWebDriver() {
        System.setProperty("webdriver.chrome.driver", "Driver files/chromedriver-win64/chromedriver.exe");
        System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        driver = new ChromeDriver(options);
        js = (JavascriptExecutor) driver;
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    private static void extractBasicInfo(Map<String, String> datasetInfo) {
        datasetInfo.put("Name", driver.findElement(By.cssSelector("h1.text-3xl")).getText());
        datasetInfo.put("Donated on", driver.findElement(By.cssSelector("h2.text-sm")).getText().replace("Donated on ", ""));
        datasetInfo.put("Abstract", driver.findElement(By.cssSelector("p[style*=clamp]")).getText());
    }

    private static void extractCharacteristics(Map<String, String> datasetInfo) {
        List<WebElement> characteristics = driver.findElements(By.cssSelector("div.col-span-4"));
        for (WebElement characteristic : characteristics) {
            String key = characteristic.findElement(By.cssSelector("h1.text-lg")).getText();
            String value = characteristic.findElement(By.cssSelector("p.text-md")).getText();
            datasetInfo.put(key, value);
        }
    }

    private static void extractCreatorsAndDOI(Map<String, String> datasetInfo) {
        List<WebElement> creators = driver.findElements(By.cssSelector("div:contains(Creators) + div p"));
        datasetInfo.put("Creators", creators.stream().map(WebElement::getText).reduce((a, b) -> a + ", " + b).orElse(""));
        datasetInfo.put("DOI", driver.findElement(By.cssSelector("a[href*=doi.org]")).getText());
    }

    private static void extractLicense(Map<String, String> datasetInfo) {
        WebElement licenseElement = driver.findElement(By.xpath("//div[contains(text(), 'License')]/following-sibling::div"));
        datasetInfo.put("License", licenseElement.getText().replaceAll("\\s+", " ").trim());
    }

    private static void extractDatasetInfo(Map<String, String> datasetInfo) {
        WebElement datasetInfoSection = driver.findElement(By.xpath("//div[contains(text(), 'Dataset Information')]"));
        String fullInfo = (String) js.executeScript(
                "return arguments[0].nextElementSibling.querySelector('div[x-data]').getAttribute('x-data')",
                datasetInfoSection
        );
        fullInfo = fullInfo.replaceAll(".*full:\\s*'([^']*)'.*", "$1")
                .replaceAll("\\\\n", "\n").replaceAll("\\\\", "");
        datasetInfo.put("Dataset Information", fullInfo);
    }

    private static void extractVariablesTable(Map<String, String> datasetInfo) {
        WebElement table = driver.findElement(By.xpath("//table[contains(., 'Variable Name')]"));
        List<WebElement> rows = table.findElements(By.tagName("tr"));
        StringBuilder variablesInfo = new StringBuilder();
        for (WebElement row : rows) {
            List<WebElement> cols = row.findElements(By.tagName("td"));
            if (cols.isEmpty()) {
                cols = row.findElements(By.tagName("th"));
            }
            variablesInfo.append(cols.stream().map(WebElement::getText).reduce((a, b) -> a + "\t" + b).orElse("")).append("\n");
        }
        datasetInfo.put("Variables Table", variablesInfo.toString());

        // Handle pagination if exists
        WebElement nextButton = driver.findElement(By.xpath("//button[@aria-label='Next Page']"));
        while (!nextButton.getAttribute("disabled").equals("true")) {
            nextButton.click();
            wait.until(ExpectedConditions.stalenessOf(table));
            table = driver.findElement(By.xpath("//table[contains(., 'Variable Name')]"));
            rows = table.findElements(By.tagName("tr"));
            for (WebElement row : rows.subList(1, rows.size())) { // Skip header
                List<WebElement> cols = row.findElements(By.tagName("td"));
                variablesInfo.append(cols.stream().map(WebElement::getText).reduce((a, b) -> a + "\t" + b).orElse("")).append("\n");
            }
            nextButton = driver.findElement(By.xpath("//button[@aria-label='Next Page']"));
        }
    }

    private static void extractAdditionalVarInfo(Map<String, String> datasetInfo) {
        WebElement additionalVarInfoSection = driver.findElement(By.xpath("//div[contains(text(), 'Additional Variable Information')]"));
        String fullInfo = (String) js.executeScript(
                "return arguments[0].nextElementSibling.querySelector('div[x-data]').getAttribute('x-data')",
                additionalVarInfoSection
        );
        fullInfo = fullInfo.replaceAll(".*full:\\s*'([^']*)'.*", "$1")
                .replaceAll("\\\\n", "\n").replaceAll("\\\\", "");
        datasetInfo.put("Additional Variable Information", fullInfo);
    }

    private static void extractDatasetFiles(Map<String, String> datasetInfo) {
        WebElement filesTable = driver.findElement(By.xpath("//table[contains(., 'File')]"));
        List<WebElement> rows = filesTable.findElements(By.tagName("tr"));
        StringBuilder filesInfo = new StringBuilder();
        for (WebElement row : rows.subList(1, rows.size())) { // Skip header
            List<WebElement> cols = row.findElements(By.tagName("td"));
            if (!cols.isEmpty()) {
                filesInfo.append(cols.get(0).getText()).append(" (").append(cols.get(1).getText()).append(")\n");
            }
        }
        datasetInfo.put("Dataset Files", filesInfo.toString());
    }

    private static void extractCitationsViewsReviews(Map<String, String> datasetInfo) {
        String citations = driver.findElement(By.xpath("//div[contains(@class, 'text-primary') and contains(text(), 'citations')]"))
                .getText().replaceAll("\\D+", "");
        datasetInfo.put("Citations", citations);

        String views = driver.findElement(By.xpath("//div[contains(@class, 'text-primary') and contains(text(), 'views')]"))
                .getText().replaceAll("\\D+", "");
        datasetInfo.put("Views", views);

        String reviews = driver.findElement(By.xpath("//div[contains(text(), 'Reviews')]/..//p[@class='text-md']"))
                .getText().replaceAll("\\D+", "");
        datasetInfo.put("Reviews", reviews);
    }
}