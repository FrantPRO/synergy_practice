#include <iostream>
#include "TaskList.h"

void showMenu() {
    std::cout << "1. Add Task" << std::endl;
    std::cout << "2. Delete Task" << std::endl;
    std::cout << "3. Mark Task as Completed" << std::endl;
    std::cout << "4. Display Tasks" << std::endl;
    std::cout << "5. Display Completed Tasks" << std::endl;
    std::cout << "6. Save Tasks to File" << std::endl;
    std::cout << "7. Load Tasks from File" << std::endl;
    std::cout << "0. Exit" << std::endl;
}

int main() {
    TaskList taskList;
    int choice;
    std::string description;
    int index;
    std::string filename;

    do {
        showMenu();
        std::cout << "Enter your choice: ";
        std::cin >> choice;
        std::cin.ignore();

        switch (choice) {
            case 1:
                std::cout << "Enter task description: ";
                std::getline(std::cin, description);
                taskList.addTask(description);
                break;
            case 2:
                std::cout << "Enter task number to delete: ";
                std::cin >> index;
                taskList.deleteTask(index - 1);
                break;
            case 3:
                std::cout << "Enter task number to mark as completed: ";
                std::cin >> index;
                taskList.markTaskCompleted(index - 1);
                break;
            case 4:
                taskList.displayTasks();
                break;
            case 5:
                taskList.displayCompletedTasks();
                break;
            case 6:
                std::cout << "Enter filename to save tasks: ";
                std::cin >> filename;
                taskList.saveToFile(filename);
                break;
            case 7:
                std::cout << "Enter filename to load tasks: ";
                std::cin >> filename;
                taskList.loadFromFile(filename);
                break;
            case 0:
                std::cout << "Exiting..." << std::endl;
                break;
            default:
                std::cout << "Invalid choice, please try again." << std::endl;
        }
    } while (choice != 0);

    return 0;
}
