<?php

namespace App\Controller;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\Date;

class TasksController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private TaskRepository $taskRepository;

    public function __construct(EntityManagerInterface $entityManager, TaskRepository $taskRepository)
    {
        $this->entityManager = $entityManager;
        $this->taskRepository = $taskRepository;
    }

    #[Route('/api/tasks/getAll', name: 'app_tasks')]
    public function getAll(): Response
    {
        $allTasks = [];

        foreach ($this->taskRepository->findAll() as $task)
        {
            $allTasks[] = $task->toArray();
        }

        return $this->json($allTasks);
    }

    #[Route('api/tasks/createTask', name: 'app_create_task')]
    public function createTask(Request $request)
    {
        $content = json_decode($request->getContent(), true);

        $task = new Task();

        $requiredFields = ['title', 'startDate', 'dueDate'];
        foreach ($requiredFields as $field)
        {
            if (!isset($content[$field]))
            {
                return $this->json(['isSuccess' => false, 'message' => "Необходимо заполнить обязательные поля: {$field}"]);
            }
        }
		if (!isset($content['description']) || !is_string($content['description']))
		{
			$content['description'] = '';
		}

        $startDate = \DateTime::createFromFormat('Y-m-d\TH:i', $content['startDate']);
        $dueDate = \DateTime::createFromFormat('Y-m-d\TH:i', $content['dueDate']);

        $task->setTitle($content['title']);
        $task->setStartDate($startDate);
        $task->setDueDate($dueDate);
        $task->setEstimate($dueDate->diff($startDate)->days * 24);
        $task->setDescription($content['description']);

        try
        {
            $this->entityManager->persist($task);
            $this->entityManager->flush();

            return $this->json(['isSuccess' => true, 'task' => $task->toArray()]);
        } catch (\Exception $e)
        {
            return $this->json(['isSuccess' => false, 'message' => $e->getMessage()]);
        }
    }

    #[Route('api/tasks/deleteTask', name: 'app_delete_task')]
    public function deleteTask(Request $request)
    {
        $content = json_decode($request->getContent(), true);
        $taskId = (int)($content['taskId'] ?? 0);

        $task = $this->taskRepository->find($taskId);
        if ($task)
        {
            $this->entityManager->remove($task);
            $this->entityManager->flush();

            return $this->json([
                'isSuccess' => true,
            ]);
        }
        else
        {
            return $this->json([
                'isSuccess' => false,
                'message' => 'Задача не найдена'
            ]);
        }
    }
}
