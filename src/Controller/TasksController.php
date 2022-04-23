<?php

namespace App\Controller;

use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/tasks')]
class TasksController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private TaskRepository $taskRepository;

    public function __construct(EntityManagerInterface $entityManager, TaskRepository $taskRepository)
    {
        $this->entityManager = $entityManager;
        $this->taskRepository = $taskRepository;
    }

    #[Route('/getAll', name: 'app_tasks')]
    public function index(): Response
    {
        $allTasks = [];

        foreach ($this->taskRepository->findAll() as $task)
        {
            $allTasks[] = $task->toArray();
        }

        return $this->json($allTasks);
    }
}
