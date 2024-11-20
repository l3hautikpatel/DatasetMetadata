import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.List;

public class SimpleSeleniumTest {
    public static void main(String[] args) {
        // Set up ChromeDriver (make sure to update the path to your ChromeDriver executable)
        System.setProperty("webdriver.chrome.driver", "Driver files/chromedriver-win64/chromedriver.exe");

        // Create a new instance of the Chrome driver
        WebDriver driver = new ChromeDriver();

        try {
            // Navigate to the desired webpage (use your actual URL)
            driver.get("https://archive.ics.uci.edu/dataset/53/iris");

            // Use XPath to find the elements after "Creators" and print the text
            List<WebElement> creatorsElements = driver.findElements(By.xpath("//html/body/div/div[1]/div[1]/main/div/div[1]/div[4]/div[2]/div/div/div[1]/table/tbody"));

            // Loop through the elements and print the text

            System.out.println("hello");
            for (WebElement element : creatorsElements) {
                System.out.println("Element Text: " + element.getText());
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // Close the browser
            driver.quit();
        }
    }
}
