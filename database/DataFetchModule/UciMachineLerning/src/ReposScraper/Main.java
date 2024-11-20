package ReposScraper;

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


public class Main {

    public static final String BASE_URL = "https://archive.ics.uci.edu/dataset/";
    public static WebDriver driver;
    public static JavascriptExecutor js;
    public static WebDriverWait wait;



    public static void main(String[] args) {
        setupWebDriver();
        RepoScrapByDataSet repoScrapByDataSet = new RepoScrapByDataSet();
        ArrayList<Integer> dataSetNumberList = new ArrayList<>();

        AllRepoInfoCollecter arrayListForDatasetNumber = new AllRepoInfoCollecter();
        //repoScrapByDataSet.scrapMetadata(driver, wait, 45);
       //arrayListForDatasetNumber.arrayListForDatasetNumber(driver, wait,"https://archive.ics.uci.edu/datasets" ,dataSetNumberList);

        int[] maually = {335, 253,358,282};

        for (int i = 0; i < maually.length; i++) {
            dataSetNumberList.add(maually[i]);
        }

            for (int i = 0; i < dataSetNumberList.size(); i++) {
                repoScrapByDataSet.scrapMetadata(driver, wait, dataSetNumberList.get(i));
            }
        driver.close();
    }





    public static void setupWebDriver() {
        System.setProperty("webdriver.chrome.driver", "E:\\Uwindsor\\SEM~2\\ADT\\project\\AdtMlDataScrap\\Driver files\\chromedriver-win64\\chromedriver.exe");
        ChromeOptions options = new ChromeOptions();
        //options.addArguments("--headless");
        driver = new ChromeDriver(options);
        //js = (JavascriptExecutor) driver;
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }
}
