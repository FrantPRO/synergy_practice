package src;

import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        DataReader dataReader = new DataReader();
        DataProcessor dataProcessor = new DataProcessor();
        DataSaver dataSaver = new DataSaver();

        // Чтение данных из файла
        List<String> data = dataReader.readDataFromFile("Case_task_4/dist/production/SynergyPractice/data/input.txt");

        // Обработка данных (сортировка)
        List<String> sortedData = dataProcessor.sortData(data);

        // Вывод отсортированных данных
        System.out.println("Sorted Data:");
        for (String line : sortedData) {
            System.out.println(line);
        }

        // Сохранение отсортированных данных в файл
        dataSaver.saveDataToFile(sortedData, "Case_task_4/dist/production/SynergyPractice/data/output.txt");

        // Ввод данных пользователем
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter data (type 'exit' to finish):");
        while (true) {
            String userInput = scanner.nextLine();
            if ("exit".equalsIgnoreCase(userInput)) {
                break;
            }
            sortedData.add(userInput);
        }

        // Сохранение данных с учетом пользовательского ввода
        dataSaver.saveDataToFile(sortedData, "Case_task_4/dist/production/SynergyPractice/data/output_with_user_input.txt");
        System.out.println("Data saved to output_with_user_input.txt");
    }
}
