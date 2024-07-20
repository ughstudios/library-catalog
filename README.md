## Setup Instructions

### Prerequisites

- Python 3.12
- Django
- Poetry

### Installation

1. Install dependencies with poetry:
    ```poetry install```

3. Configure the database:
    Update the `settings.py` file with your database configuration.

4. Apply migrations:
    ```bash
    python src/run.py migrate
    ```

5. Run the server:
    ```bash
    python src/run.py runserver
    ```
