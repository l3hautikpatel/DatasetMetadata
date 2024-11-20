package ReposScraper;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.ArrayList;
import java.util.List;

public class AllRepoInfoCollecter {

    public static void arrayListForDatasetNumber(WebDriver driver, WebDriverWait wait,  String path , ArrayList<Integer> arrayList){

        driver.get(path);
        try{
            Thread.sleep(2000);
            WebElement dropdownXpath = wait.until(ExpectedConditions.elementToBeClickable(
                    By.xpath("/html/body/div[1]/div[1]/main/div/div[2]/div[3]/label/select")));
            Select selectXpath = new Select(dropdownXpath);
            selectXpath.selectByValue("25");
        }
        catch(Exception e){}

        int count = 0 ;
        while (true) {
            count++;
            try {
                Thread.sleep(2000);
                // Find all divs with the specified role
                List<WebElement> datasetDivs = driver.findElements(By.xpath("/html/body/div[1]/div[1]/main/div/div[2]/div[2]/div[@role='row']"));
                for (WebElement div : datasetDivs) {
                    try {
                        // Look for the anchor tag with the dataset link
                        WebElement anchor = div.findElement(By.cssSelector("h2.truncate a.link-hover"));
                        String href = anchor.getAttribute("href");
                        // Extract the dataset ID from the href
                        if (href != null && href.contains("/dataset/")) {
                            // Split the href by "/" and get the number
                            String[] parts = href.split("/");
                            for (int i = 0; i < parts.length; i++) {
                                if (parts[i].equals("dataset") && i + 1 < parts.length) {
                                    String datasetId = parts[i + 1];
                                    try {
                                        arrayList.add(Integer.parseInt(datasetId));
                                    } catch (NumberFormatException e) {
                                        continue;
                                    }
                                    break;
                                }
                            }
                        }
                    } catch (Exception e) {
                        continue;
                    }
                }
            } catch (Exception e) {
            }
            WebElement nextButton = driver.findElement(By.cssSelector("button[aria-label='Next Page']"));
            if (nextButton.getAttribute("disabled") != null) {
                break;
            } else {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", nextButton);
            }
        }
        System.out.println("total number of dataset : " + arrayList.size());


    }
}
