using JypTurismo.Core.Entities;

namespace JypTurismo.Core.Interfaces;

/// <summary>
/// Unit of Work pattern interface for managing database transactions.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    /// <summary>
    /// Gets the repository for Message entities.
    /// </summary>
    IRepository<Message> Messages { get; }

    /// <summary>
    /// Gets the repository for Conversation entities.
    /// </summary>
    IRepository<Conversation> Conversations { get; }

    /// <summary>
    /// Gets the repository for Contact entities.
    /// </summary>
    IRepository<Contact> Contacts { get; }

    /// <summary>
    /// Gets the repository for Attachment entities.
    /// </summary>
    IRepository<Attachment> Attachments { get; }

    /// <summary>
    /// Saves all pending changes to the database.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>The number of affected records.</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Begins a new database transaction.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Commits the current transaction.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token.</param>
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rolls back the current transaction.
    /// </summary>
    Task RollbackTransactionAsync();
}
