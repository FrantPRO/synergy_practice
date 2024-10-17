import java.util.Scanner;

public class TaskManager {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        TaskList taskList = new TaskList();
        String filename = "Case_task_5/tasks.ser";

        // Load tasks from file
        taskList.loadFromFile(filename);

        while (true) {
            System.out.println("\nTask Manager");
            System.out.println("1. Add task");
            System.out.println("2. Remove task");
            System.out.println("3. Mark task as completed");
            System.out.println("4. Display all tasks");
            System.out.println("5. Display completed tasks");
            System.out.println("6. Save and exit");
            System.out.print("Choose an option: ");

            int choice = scanner.nextInt();
            scanner.nextLine();  // Consume newline

            switch (choice) {
                case 1:
                    System.out.print("Enter task description: ");
                    String description = scanner.nextLine();
                    taskList.addTask(description);
                    break;
                case 2:
                    System.out.print("Enter task index to remove: ");
                    int removeIndex = scanner.nextInt();
                    taskList.removeTask(removeIndex);
                    break;
                case 3:
                    System.out.print("Enter task index to mark as completed: ");
                    int completeIndex = scanner.nextInt();
                    taskList.markTaskAsCompleted(completeIndex);
                    break;
                case 4:
                    taskList.displayTasks();
                    break;
                case 5:
                    taskList.displayCompletedTasks();
                    break;
                case 6:
                    taskList.saveToFile(filename);
                    System.out.println("Tasks saved. Exiting...");
                    return;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
    }
}
