#ifndef TASKLIST_H
#define TASKLIST_H

#include <vector>
#include <string>
#include "Task.h"

class TaskList {
private:
    std::vector<Task> tasks;

public:
    void addTask(const std::string& description);
    void deleteTask(int index);
    void markTaskCompleted(int index);
    void displayTasks() const;
    void displayCompletedTasks() const;
    void saveToFile(const std::string& filename) const;
    void loadFromFile(const std::string& filename);
};

#endif // TASKLIST_H
