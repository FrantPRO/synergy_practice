#include "Task.h"

Task::Task(const std::string& desc) : description(desc), is_completed(false) {}

void Task::markCompleted() {
    is_completed = true;
}

bool Task::isCompleted() const {
    return is_completed;
}

std::string Task::getDescription() const {
    return description;
}
