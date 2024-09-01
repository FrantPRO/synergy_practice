#ifndef TASK_H
#define TASK_H

#include <string>

class Task {
private:
    std::string description;
    bool is_completed;

public:
    Task(const std::string& desc);

    void markCompleted();
    bool isCompleted() const;
    std::string getDescription() const;
};

#endif // TASK_H
