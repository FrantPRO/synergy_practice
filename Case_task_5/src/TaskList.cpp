#include "TaskList.h"
#include <iostream>
#include <fstream>

void TaskList::addTask(const std::string& description) {
    tasks.push_back(Task(description));
}

void TaskList::deleteTask(int index) {
    if (index >= 0 && index < tasks.size()) {
        tasks.erase(tasks.begin() + index);
    }
}

void TaskList::markTaskCompleted(int index) {
    if (index >= 0 && index < tasks.size()) {
        tasks[index].markCompleted();
    }
}

void TaskList::displayTasks() const {
    for (int i = 0; i < tasks.size(); ++i) {
        std::cout << i + 1 << ". " << tasks[i].getDescription()
                  << (tasks[i].isCompleted() ? " [Completed]" : "") << std::endl;
    }
}

void TaskList::displayCompletedTasks() const {
    for (int i = 0; i < tasks.size(); ++i) {
        if (tasks[i].isCompleted()) {
            std::cout << i + 1 << ". " << tasks[i].getDescription() << std::endl;
        }
    }
}

void TaskList::saveToFile(const std::string& filename) const {
    std::ofstream file(filename);
    for (const auto& task : tasks) {
        file << task.getDescription() << "|" << task.isCompleted() << std::endl;
    }
    file.close();
}

void TaskList::loadFromFile(const std::string& filename) {
    std::ifstream file(filename);
    std::string line;
    tasks.clear();
    while (std::getline(file, line)) {
        size_t delimiter_pos = line.find('|');
        std::string description = line.substr(0, delimiter_pos);
        bool is_completed = std::stoi(line.substr(delimiter_pos + 1));
        Task task(description);
        if (is_completed) {
            task.markCompleted();
        }
        tasks.push_back(task);
    }
    file.close();
}
